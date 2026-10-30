// End-to-end checks for the form spam protection (src/lib/formGuard.ts) on
// /api/contact, /api/launch-list and /api/booking.
//
//   npm run build
//   docker run -d --name nx-formguard-mongo -p 127.0.0.1:27018:27017 mongo:7
//   npm run test:form-guard            # or: TEST_MONGODB_URI=mongodb://127.0.0.1:27018 node scripts/form-guard/test.mjs
//
// It starts `next start` against a LOCAL MongoDB only (it refuses any other
// host), inside sandbox.mjs: Resend calls are recorded to a file instead of
// sent, and any other network access throws. It empties the test database's
// form collections first. Never point it at production.

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MongoClient } from 'mongodb';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SANDBOX = pathToFileURL(path.join(ROOT, 'scripts/form-guard/sandbox.mjs')).href;
const NEXT_BIN = path.join(ROOT, 'node_modules/next/dist/bin/next');
const TEST_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27018';
const DEAD_URI = 'mongodb://127.0.0.1:1/?serverSelectionTimeoutMS=1500';
const SALT = 'nesture-x-form-guard'; // formGuard's default, used when RATE_LIMIT_SALT is unset
const PORT = 3201;
const BASE = `http://127.0.0.1:${PORT}`;

// ── Safety ──────────────────────────────────────────────────────────────────

const host = new URL(TEST_URI.replace(/^mongodb(\+srv)?:/, 'http:')).hostname;
if (TEST_URI.startsWith('mongodb+srv:') || !['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host)) {
  console.error(`Refusing to run: TEST_MONGODB_URI must be a local MongoDB, got host "${host}".`);
  process.exit(2);
}
if (!existsSync(path.join(ROOT, '.next/BUILD_ID'))) {
  console.error('No production build found. Run `npm run build` first.');
  process.exit(2);
}

// ── Harness ─────────────────────────────────────────────────────────────────

const work = mkdtempSync(path.join(tmpdir(), 'form-guard-'));
const EMAIL_LOG = path.join(work, 'emails.jsonl');
writeFileSync(EMAIL_LOG, '');
let server; let serverLog = '';

async function startServer(mongoUri) {
  serverLog = '';
  server = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      MONGODB_URI: mongoUri,
      RESEND_API_KEY: 're_sandbox_not_a_real_key',
      VERCEL: '1', // trust x-real-ip / x-forwarded-for, as on Vercel, so each test can use its own IP
      RATE_LIMIT_SALT: '',
      FORM_GUARD_EMAIL_LOG: EMAIL_LOG,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import ${SANDBOX}`.trim(),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', d => { serverLog += d; });
  server.stderr.on('data', d => { serverLog += d; });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${BASE}/api/keepalive`)).status < 500) return; } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error(`server did not start:\n${serverLog}`);
}

async function stopServer() {
  if (!server) return;
  const done = new Promise(r => server.once('exit', r));
  server.kill();
  await done;
  server = undefined;
}

const emailsSent = () => readFileSync(EMAIL_LOG, 'utf8').split('\n').filter(Boolean).length;
const ipHash = ip => createHash('sha256').update(`${SALT}:${ip}`).digest('hex');

async function post(route, body, { ip, raw, headers = {} } = {}) {
  const res = await fetch(`${BASE}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(ip ? { 'x-real-ip': ip } : {}), ...headers },
    body: raw ?? JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* empty */ }
  return { status: res.status, json, retryAfter: res.headers.get('retry-after') };
}

let passed = 0; let failed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ok    ${name}`); }
  catch (err) { failed++; console.log(`  FAIL  ${name}\n        ${err.message}`); }
}
function expect(cond, msg) { if (!cond) throw new Error(msg); }

// ── Fixtures ────────────────────────────────────────────────────────────────

const contact = n => ({ name: `Test ${n}`, email: `test${n}@example.com`, brief: 'Test brief', service: 'Website' });
const signup = n => ({ email: `signup${n}@example.com`, projectSlug: 'kikota', projectName: 'Kikota', source: 'test' });

// Distinct valid booking slots: weekdays from tomorrow, seven slots a day.
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
const freeSlots = (() => {
  const out = []; const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = 1; out.length < 40 && i <= 30; i++) {
    const day = new Date(d); day.setDate(d.getDate() + i);
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    for (const t of SLOTS) out.push({ date: key, timeSlot: t });
  }
  return out;
})();
const booking = n => ({ name: `Booker ${n}`, email: `book${n}@example.com`, phone: '+254 700 000 000', service: 'Website', ...freeSlots.shift() });

// ── Run ─────────────────────────────────────────────────────────────────────

const mongo = new MongoClient(TEST_URI, { serverSelectionTimeoutMS: 3000 });
await mongo.connect();
const db = mongo.db('nesture-x');
for (const c of ['leads', 'launchSignups', 'bookings', 'rateLimits']) await db.collection(c).deleteMany({});
const count = c => db.collection(c).countDocuments();

try {
  await startServer(TEST_URI);
  console.log(`server up on ${BASE} (MongoDB ${TEST_URI}, emails recorded, network sandboxed)\n`);

  console.log('normal submits');
  await test('contact: 200, one lead stored, owner email + auto-reply recorded', async () => {
    const [leads, mails] = [await count('leads'), emailsSent()];
    const r = await post('/api/contact', contact(1), { ip: '198.51.100.1' });
    expect(r.status === 200 && r.json?.success === true, `got ${r.status} ${JSON.stringify(r.json)}`);
    expect(await count('leads') === leads + 1, 'lead not stored');
    expect(emailsSent() === mails + 2, `expected 2 emails, got ${emailsSent() - mails}`);
  });
  await test('launch-list: 200, one signup stored, confirmation recorded', async () => {
    const [rows, mails] = [await count('launchSignups'), emailsSent()];
    const r = await post('/api/launch-list', signup(1), { ip: '198.51.100.2' });
    expect(r.status === 200 && r.json?.success === true, `got ${r.status} ${JSON.stringify(r.json)}`);
    expect(await count('launchSignups') === rows + 1, 'signup not stored');
    expect(emailsSent() === mails + 1, `expected 1 email, got ${emailsSent() - mails}`);
  });
  await test('launch-list: duplicate still answers 409', async () => {
    const r = await post('/api/launch-list', signup(1), { ip: '198.51.100.2' });
    expect(r.status === 409, `got ${r.status}`);
  });
  await test('booking: 200 with bookingId, one booking stored, two emails recorded', async () => {
    const [rows, mails] = [await count('bookings'), emailsSent()];
    const r = await post('/api/booking', booking(1), { ip: '198.51.100.3' });
    expect(r.status === 200 && r.json?.success === true && /^[0-9a-f]{24}$/.test(r.json?.bookingId), `got ${r.status} ${JSON.stringify(r.json)}`);
    expect(await count('bookings') === rows + 1, 'booking not stored');
    expect(emailsSent() === mails + 2, `expected 2 emails, got ${emailsSent() - mails}`);
  });

  console.log('\nhoneypot');
  for (const [route, body, coll, shape] of [
    ['/api/contact', contact(2), 'leads', j => j?.success === true],
    ['/api/launch-list', signup(2), 'launchSignups', j => j?.success === true],
    ['/api/booking', booking(2), 'bookings', j => j?.success === true && /^[0-9a-f]{24}$/.test(j?.bookingId) && j?.emailSent === true],
  ]) {
    await test(`${route}: filled trap gets the normal success response, stores and sends nothing`, async () => {
      const [rows, mails, limits] = [await count(coll), emailsSent(), await count('rateLimits')];
      const r = await post(route, { ...body, website: 'https://spam.example' }, { ip: '198.51.100.9' });
      expect(r.status === 200 && shape(r.json), `got ${r.status} ${JSON.stringify(r.json)}`);
      expect(await count(coll) === rows, `${coll} was written`);
      expect(emailsSent() === mails, 'an email was sent');
      expect(await count('rateLimits') === limits, 'dropped submission was counted against a limit');
    });
  }
  await test('empty trap (what people send) is a normal submit', async () => {
    const r = await post('/api/contact', { ...contact(3), website: '' }, { ip: '198.51.100.10' });
    expect(r.status === 200 && await db.collection('leads').findOne({ email: 'test3@example.com' }), `got ${r.status}`);
  });

  console.log('\nrate limit');
  for (const [route, form, limit, make, coll] of [
    ['/api/contact', 'contact', 5, n => contact(100 + n), 'leads'],
    ['/api/launch-list', 'launch-list', 10, n => signup(100 + n), 'launchSignups'],
    ['/api/booking', 'booking', 5, n => booking(100 + n), 'bookings'],
  ]) {
    const ip = `203.0.113.${limit}${form.length}`;
    await test(`${route}: ${limit} allowed, request ${limit + 1} gets 429 with Retry-After, nothing stored`, async () => {
      for (let i = 1; i <= limit; i++) {
        const r = await post(route, make(i), { ip });
        expect(r.status === 200, `request ${i} got ${r.status} ${JSON.stringify(r.json)}`);
      }
      const [rows, mails] = [await count(coll), emailsSent()];
      const r = await post(route, make(limit + 1), { ip });
      expect(r.status === 429, `request ${limit + 1} got ${r.status}`);
      const secs = Number(r.retryAfter);
      expect(Number.isInteger(secs) && secs > 3500 && secs <= 3600, `Retry-After was "${r.retryAfter}"`);
      expect(typeof r.json?.error === 'string' && /Too many attempts/.test(r.json.error), `error was ${JSON.stringify(r.json)}`);
      expect(await count(coll) === rows && emailsSent() === mails, 'the 429 request was stored or emailed');
      console.log(`        429 message: "${r.json.error}"  Retry-After: ${r.retryAfter}`);
    });
    await test(`${route}: another IP is not affected`, async () => {
      const r = await post(route, make(50), { ip: `203.0.113.200` });
      expect(r.status === 200, `got ${r.status}`);
    });
    await test(`${route}: limit resets once the window has passed`, async () => {
      const id = `${form}:${ipHash(ip)}`;
      const moved = await db.collection('rateLimits').updateOne({ _id: id }, { $set: { resetAt: new Date(Date.now() - 1000) } });
      expect(moved.matchedCount === 1, `no counter found for ${id}`);
      const r = await post(route, make(60), { ip });
      expect(r.status === 200, `got ${r.status} ${JSON.stringify(r.json)}`);
      const doc = await db.collection('rateLimits').findOne({ _id: id });
      expect(doc.count === 1 && doc.resetAt > new Date(Date.now() + 3500e3), `counter not restarted: ${JSON.stringify(doc)}`);
    });
  }
  await test('parallel burst: exactly the limit gets through (atomic counter)', async () => {
    const results = await Promise.all(Array.from({ length: 9 }, (_, i) => post('/api/contact', contact(300 + i), { ip: '203.0.113.77' })));
    const ok = results.filter(r => r.status === 200).length, limited = results.filter(r => r.status === 429).length;
    expect(ok === 5 && limited === 4, `200s: ${ok}, 429s: ${limited}`);
  });
  await test('x-forwarded-for: the first (client) address is used when x-real-ip is absent', async () => {
    await post('/api/contact', contact(400), { headers: { 'x-forwarded-for': '192.0.2.44, 10.0.0.1' } });
    expect(await db.collection('rateLimits').findOne({ _id: `contact:${ipHash('192.0.2.44')}` }), 'no counter for the client address');
  });
  await test('stored keys are hashes; no raw IP anywhere in rateLimits', async () => {
    const docs = await db.collection('rateLimits').find().toArray();
    const dump = JSON.stringify(docs);
    expect(docs.length > 0 && docs.every(d => /^(contact|launch-list|booking):[0-9a-f]{64}$/.test(d._id)), 'unexpected key format');
    expect(!/\d+\.\d+\.\d+\.\d+/.test(dump), 'a raw IP was stored');
  });
  await test('rateLimits has a TTL index on resetAt', async () => {
    const idx = await db.collection('rateLimits').indexes();
    expect(idx.some(i => i.key?.resetAt === 1 && i.expireAfterSeconds === 0), JSON.stringify(idx));
  });

  console.log('\nbody size and format');
  for (const [route, body, coll] of [
    ['/api/contact', { ...contact(500), brief: 'x'.repeat(40 * 1024) }, 'leads'],
    ['/api/launch-list', { ...signup(500), source: 'x'.repeat(3 * 1024) }, 'launchSignups'],
    ['/api/booking', { ...booking(500), service: 'x'.repeat(5 * 1024) }, 'bookings'],
  ]) {
    await test(`${route}: oversized body gets 413, nothing stored or sent`, async () => {
      const [rows, mails] = [await count(coll), emailsSent()];
      const r = await post(route, body, { ip: '198.51.100.50' });
      expect(r.status === 413 && typeof r.json?.error === 'string', `got ${r.status} ${JSON.stringify(r.json)}`);
      expect(await count(coll) === rows && emailsSent() === mails, 'oversized request was stored or emailed');
    });
  }
  await test('contact: a long but normal brief (20 KB) is still accepted', async () => {
    const r = await post('/api/contact', { ...contact(501), brief: 'word '.repeat(4000) }, { ip: '198.51.100.51' });
    expect(r.status === 200, `got ${r.status}`);
  });
  for (const route of ['/api/contact', '/api/booking']) {
    await test(`${route}: malformed email gets 400 "Enter a valid email address."`, async () => {
      const body = route === '/api/contact' ? { ...contact(600), email: 'not-an-email' } : { ...booking(600), email: 'not-an-email' };
      const r = await post(route, body, { ip: '198.51.100.60' });
      expect(r.status === 400 && r.json?.error === 'Enter a valid email address.', `got ${r.status} ${JSON.stringify(r.json)}`);
    });
  }
  await test('malformed JSON still gets the route\'s existing 500 message', async () => {
    const r = await post('/api/contact', null, { ip: '198.51.100.61', raw: '{"name":' });
    expect(r.status === 500 && /WhatsApp/.test(r.json?.error ?? ''), `got ${r.status} ${JSON.stringify(r.json)}`);
  });

  await stopServer();

  console.log('\nstore down (MongoDB unreachable)');
  await startServer(DEAD_URI);
  await test('contact: limiter fails open, the enquiry still goes out by email (200)', async () => {
    const mails = emailsSent(); const t = Date.now();
    const r = await post('/api/contact', contact(700), { ip: '198.51.100.70' });
    expect(r.status === 200 && r.json?.success === true, `got ${r.status} ${JSON.stringify(r.json)}`);
    expect(emailsSent() === mails + 2, `expected 2 emails, got ${emailsSent() - mails}`);
    expect(/\[form-guard\] rate limit check failed for contact/.test(serverLog), 'fail-open was not logged');
    console.log(`        answered in ${Date.now() - t} ms; logged: "${serverLog.match(/\[form-guard\][^\n]*/)[0].slice(0, 90)}..."`);
  });
  await test('launch-list: limiter fails open (no 429); the route then reports its own DB error as before', async () => {
    const r = await post('/api/launch-list', signup(700), { ip: '198.51.100.70' });
    expect(r.status !== 429, 'got 429 while the store was down');
    expect(/rate limit check failed for launch-list/.test(serverLog), 'fail-open was not logged');
    console.log(`        status ${r.status}: "${r.json?.error}" (signups need the DB, unchanged)`);
  });
} finally {
  await stopServer();
  await mongo.close();
  rmSync(work, { recursive: true, force: true });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
