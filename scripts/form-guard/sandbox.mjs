// Test-only network sandbox for scripts/form-guard/test.mjs, loaded into the
// Next server with `node --import`. Two jobs:
//   1. Resend calls never leave the machine: they are recorded to
//      FORM_GUARD_EMAIL_LOG (one JSON line each) and answered with a fake id.
//   2. Nothing else can reach the network either: DNS lookups and socket
//      connections to anything but localhost throw. So even a stray production
//      MONGODB_URI or API key in .env.local can't be used by a test run.

import dns from 'node:dns';
import fs from 'node:fs';
import net from 'node:net';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '']);
const isLocal = host => LOCAL_HOSTS.has(String(host ?? '').replace(/^\[|\]$/g, '')) || /^127\./.test(String(host));
const blocked = host => Object.assign(new Error(`[form-guard sandbox] blocked network access to ${host}`), { code: 'ENOTFOUND' });

// DNS: callback and promise APIs, including SRV/TXT used by mongodb+srv:// URIs.
for (const name of ['lookup', 'resolve', 'resolve4', 'resolve6', 'resolveSrv', 'resolveTxt', 'resolveAny']) {
  const original = dns[name];
  if (typeof original !== 'function') continue;
  dns[name] = function (host, ...rest) {
    if (isLocal(host)) return original.call(this, host, ...rest);
    const cb = rest.findLast?.(arg => typeof arg === 'function');
    if (cb) return process.nextTick(cb, blocked(host));
    throw blocked(host);
  };
  const promised = dns.promises[name];
  if (typeof promised === 'function') {
    dns.promises[name] = (host, ...rest) => (isLocal(host) ? promised(host, ...rest) : Promise.reject(blocked(host)));
  }
}

// Sockets: covers anything that resolves an address some other way.
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const opts = Array.isArray(args[0]) ? args[0][0] : args[0];
  const host = typeof opts === 'object' && opts !== null ? (opts.host ?? 'localhost') : (typeof args[1] === 'string' ? args[1] : 'localhost');
  if (typeof opts === 'object' && opts?.path) return connect.apply(this, args); // local IPC
  if (!isLocal(host)) throw blocked(host);
  return connect.apply(this, args);
};

// Resend: record instead of send.
const LOG = process.env.FORM_GUARD_EMAIL_LOG;
const realFetch = globalThis.fetch;
let sent = 0;
globalThis.fetch = async function (input, init) {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname === 'api.resend.com') {
    let body = {};
    try { body = JSON.parse(init?.body ?? '{}'); } catch { /* not JSON */ }
    if (LOG) fs.appendFileSync(LOG, JSON.stringify({ path: url.pathname, to: body.to, subject: body.subject }) + '\n');
    sent += 1;
    return new Response(JSON.stringify({ id: `sandbox_${sent}` }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  if (!isLocal(url.hostname)) throw blocked(url.hostname);
  return realFetch(input, init);
};
