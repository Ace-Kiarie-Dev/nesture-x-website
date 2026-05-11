'use client';

import { useState, useCallback, useRef } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Word list (200 words) ─────────────────────────────────────────────────────

const WORDS = [
  'apple','arrow','amber','atlas','azure','badge','basin','beach','blade','blaze',
  'bloom','bold','brave','bridge','bright','acorn','arctic','birch','cabin','calm',
  'cedar','chalk','charm','chief','chill','clear','cliff','cloud','coral','crest',
  'crisp','crown','dagger','delta','dense','depth','denim','drift','dusk','dusty',
  'eagle','early','earth','ebony','elder','ember','empty','epoch','falcon','fern',
  'flair','flank','flame','flare','flint','flute','foam','forge','frost','garnet',
  'ghost','giant','glade','glaze','globe','glow','golden','grace','grain','grand',
  'gravel','green','grove','harbor','haste','haven','haze','hedge','helm','heron',
  'hollow','honey','hyper','igloo','index','inlet','iris','iron','island','ivory',
  'jade','jewel','joust','jungle','karma','kelp','kite','knoll','lance','lapis',
  'larch','laser','lemon','light','lotus','lunar','manor','maple','marble','marsh',
  'merit','micro','mirth','mist','morph','nadir','nexus','night','noble','north',
  'novel','oasis','ocean','olive','onyx','opaque','optic','orbit','panel','pearl',
  'piano','pixel','plain','plum','prism','probe','puma','pure','purple','quartz',
  'quest','quick','quiet','quill','raven','ridge','river','robin','rocky','royal',
  'ruby','sabre','satin','scope','scout','shade','shard','shore','silver','slate',
  'solar','sonic','steel','stone','storm','swift','tempo','thorn','thyme','tidal',
  'tiger','timber','titan','torch','tower','trail','trust','ultra','umbra','unity',
  'urban','valor','vault','venom','verge','violet','vista','vivid','waltz','warm',
];

// ── Crypto helpers ────────────────────────────────────────────────────────────

function cryptoRandInt(max: number): number {
  const arr = new Uint32Array(1);
  let result: number;
  do {
    window.crypto.getRandomValues(arr);
    result = arr[0] % max;
  } while (arr[0] - result > 0xffffffff - max + 1);
  return result;
}

function cryptoPick<T>(arr: T[]): T {
  return arr[cryptoRandInt(arr.length)];
}

// ── Strength scoring ──────────────────────────────────────────────────────────

interface Strength {
  label: string;
  pct: number;
  color: string;
}

function scorePassword(pw: string): Strength {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 20) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', pct: 25, color: '#dc2626' };
  if (score <= 3) return { label: 'Fair', pct: 50, color: '#d97706' };
  if (score <= 4) return { label: 'Strong', pct: 75, color: '#16a34a' };
  return { label: 'Very Strong', pct: 100, color: '#1a6fd4' };
}

// ── Generator functions ───────────────────────────────────────────────────────

interface PasswordOpts {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  customExclude: string;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMS  = '0123456789';
const SYMS  = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIGUOUS = '0Oo1lIi';

function generatePassword(opts: PasswordOpts): string {
  let pool = '';
  const required: string[] = [];

  const filter = (s: string) => {
    let out = s;
    if (opts.excludeAmbiguous) out = out.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    if (opts.customExclude) out = out.split('').filter(c => !opts.customExclude.includes(c)).join('');
    return out;
  };

  if (opts.upper)   { const s = filter(UPPER); pool += s; if (s.length) required.push(cryptoPick(s.split(''))); }
  if (opts.lower)   { const s = filter(LOWER); pool += s; if (s.length) required.push(cryptoPick(s.split(''))); }
  if (opts.numbers) { const s = filter(NUMS);  pool += s; if (s.length) required.push(cryptoPick(s.split(''))); }
  if (opts.symbols) { const s = filter(SYMS);  pool += s; if (s.length) required.push(cryptoPick(s.split(''))); }

  if (!pool.length) return '';

  const poolArr = pool.split('');
  const rest = Array.from({ length: Math.max(0, opts.length - required.length) }, () => cryptoPick(poolArr));
  const all = [...required, ...rest];

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = cryptoRandInt(i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.join('');
}

interface PassphraseOpts {
  wordCount: number;
  separator: string;
  capitalise: boolean;
  includeNumber: boolean;
}

function generatePassphrase(opts: PassphraseOpts): string {
  const words = Array.from({ length: opts.wordCount }, () => {
    const w = cryptoPick(WORDS);
    return opts.capitalise ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  if (opts.includeNumber) {
    const numStr = String(cryptoRandInt(100));
    const pos = cryptoRandInt(words.length + 1);
    words.splice(pos, 0, numStr);
  }
  return words.join(opts.separator);
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background: 'rgba(20, 25, 32, 0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
};

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'rgba(245,245,245,0.35)',
  display: 'block',
  marginBottom: '0.5rem',
};

const TOGGLE_BASE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  padding: '0.4rem 0.9rem',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'transparent',
  color: 'rgba(245,245,245,0.4)',
  cursor: 'pointer',
  transition: 'all 150ms',
};

const TOGGLE_ACTIVE: React.CSSProperties = {
  ...TOGGLE_BASE,
  border: '1px solid var(--color-primary)',
  background: 'rgba(26,111,212,0.15)',
  color: 'var(--color-primary)',
};

// ── Page ──────────────────────────────────────────────────────────────────────

type Mode = 'password' | 'passphrase';
type BulkCount = 1 | 5 | 10 | 20;
const SEPARATORS = [
  { label: 'Hyphen', value: '-' },
  { label: 'Underscore', value: '_' },
  { label: 'Space', value: ' ' },
  { label: 'Dot', value: '.' },
  { label: 'None', value: '' },
];

export default function PasswordGeneratorPage() {
  const [mode, setMode] = useState<Mode>('password');

  // Password mode state
  const [length, setLength] = useState(16);
  const [upper, setUpper]   = useState(true);
  const [lower, setLower]   = useState(true);
  const [nums, setNums]     = useState(true);
  const [syms, setSyms]     = useState(true);
  const [exAmbig, setExAmbig] = useState(false);
  const [customEx, setCustomEx] = useState('');
  const [advOpen, setAdvOpen] = useState(false);
  const [charWarn, setCharWarn] = useState(false);

  // Passphrase mode state
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalise, setCapitalise] = useState(false);
  const [includeNum, setIncludeNum] = useState(true);

  // Output state
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [bulkCount, setBulkCount] = useState<BulkCount>(5);
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [bulkCopied, setBulkCopied] = useState<number | null>(null);
  const [bulkAllCopied, setBulkAllCopied] = useState(false);
  const charWarnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generate = useCallback((): string => {
    if (mode === 'passphrase') {
      return generatePassphrase({ wordCount, separator, capitalise, includeNumber: includeNum });
    }
    return generatePassword({ length, upper, lower, numbers: nums, symbols: syms, excludeAmbiguous: exAmbig, customExclude: customEx });
  }, [mode, length, upper, lower, nums, syms, exAmbig, customEx, wordCount, separator, capitalise, includeNum]);

  function handleGenerate() {
    setOutput(generate());
    setCopied(false);
  }

  function handleBulk() {
    setBulkList(Array.from({ length: bulkCount }, generate));
    setBulkCopied(null);
    setBulkAllCopied(false);
  }

  function toggleCharset(which: 'upper' | 'lower' | 'nums' | 'syms') {
    const current = { upper, lower, numbers: nums, symbols: syms };
    const activeCount = [upper, lower, nums, syms].filter(Boolean).length;
    const isActive = which === 'upper' ? upper : which === 'lower' ? lower : which === 'nums' ? nums : syms;
    if (isActive && activeCount === 1) {
      if (charWarnTimer.current) clearTimeout(charWarnTimer.current);
      setCharWarn(true);
      charWarnTimer.current = setTimeout(() => setCharWarn(false), 2000);
      return;
    }
    void current;
    if (which === 'upper') setUpper(v => !v);
    else if (which === 'lower') setLower(v => !v);
    else if (which === 'nums') setNums(v => !v);
    else setSyms(v => !v);
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* silent */ }
  }

  async function copyBulkRow(i: number) {
    try {
      await navigator.clipboard.writeText(bulkList[i]);
      setBulkCopied(i);
      setTimeout(() => setBulkCopied(null), 1800);
    } catch { /* silent */ }
  }

  async function copyAllBulk() {
    try {
      await navigator.clipboard.writeText(bulkList.join('\n'));
      setBulkAllCopied(true);
      setTimeout(() => setBulkAllCopied(false), 1800);
    } catch { /* silent */ }
  }

  const strength = output ? scorePassword(output) : null;

  return (
    <main
      style={{
        padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem) clamp(4rem, 6vw, 6rem)',
        background: 'var(--color-bg)',
      }}
    >
      <BackLink />

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 8vw, 8rem)',
          lineHeight: 0.9,
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
        }}
      >
        PASSWORD GENERATOR
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
          color: 'rgba(245,245,245,0.5)',
          marginBottom: '2.5rem',
          maxWidth: '42rem',
        }}
      >
        Generate cryptographically secure passwords and passphrases. All generation happens locally — nothing leaves your browser.
      </p>

      <div style={{ maxWidth: '640px' }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
          <button style={mode === 'password' ? TOGGLE_ACTIVE : TOGGLE_BASE} onClick={() => setMode('password')}>Password</button>
          <button style={mode === 'passphrase' ? TOGGLE_ACTIVE : TOGGLE_BASE} onClick={() => setMode('passphrase')}>Passphrase</button>
        </div>

        {/* Controls */}
        <div style={{ ...GLASS, marginBottom: '1.5rem' }}>
          {mode === 'password' ? (
            <>
              {/* Length */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ ...LABEL, marginBottom: 0 }}>Length</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--color-text)' }}>{length}</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)' }}>8</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)' }}>128</span>
                </div>
              </div>

              {/* Character sets */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={LABEL}>Character Types</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    { key: 'upper' as const, label: 'Uppercase (A–Z)', active: upper },
                    { key: 'lower' as const, label: 'Lowercase (a–z)', active: lower },
                    { key: 'nums'  as const, label: 'Numbers (0–9)',   active: nums },
                    { key: 'syms'  as const, label: 'Symbols (!@#…)', active: syms },
                  ].map(({ key, label, active }) => (
                    <button
                      key={key}
                      onClick={() => toggleCharset(key)}
                      style={active ? TOGGLE_ACTIVE : TOGGLE_BASE}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {charWarn && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#d97706', marginTop: '0.4rem' }}>
                    At least one character type must be selected
                  </p>
                )}
              </div>

              {/* Advanced options */}
              <button
                onClick={() => setAdvOpen(v => !v)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.25rem',
                }}
              >
                {advOpen ? '▾' : '▸'} Advanced Options
              </button>

              {advOpen && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={exAmbig}
                      onChange={e => setExAmbig(e.target.checked)}
                      style={{ accentColor: 'var(--color-primary)', width: '15px', height: '15px' }}
                    />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.6)' }}>
                      Exclude ambiguous characters (0Oo1lIi)
                    </span>
                  </label>
                  <div>
                    <label style={LABEL}>Custom exclude characters</label>
                    <input
                      type="text"
                      value={customEx}
                      onChange={e => setCustomEx(e.target.value)}
                      placeholder="e.g. @#$"
                      style={{
                        background: 'rgba(10,10,10,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.4rem 0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        color: 'var(--color-text)',
                        outline: 'none',
                        width: '160px',
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Word count */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ ...LABEL, marginBottom: 0 }}>Word Count</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--color-text)' }}>{wordCount}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={wordCount}
                  onChange={e => setWordCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)' }}>3</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)' }}>8</span>
                </div>
              </div>

              {/* Separator */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={LABEL}>Separator</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SEPARATORS.map(s => (
                    <button
                      key={s.label}
                      onClick={() => setSeparator(s.value)}
                      style={separator === s.value ? TOGGLE_ACTIVE : TOGGLE_BASE}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={capitalise} onChange={e => setCapitalise(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.6)' }}>Capitalise words</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeNum} onChange={e => setIncludeNum(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.6)' }}>Include a number</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Generate button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <NxButton variant="primary" size="sm" onClick={handleGenerate}>
            Generate
          </NxButton>
        </div>

        {/* Output */}
        {output && (
          <div style={{ ...GLASS, marginBottom: '1.5rem' }}>
            <label style={LABEL}>Generated {mode === 'passphrase' ? 'Passphrase' : 'Password'}</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(10,10,10,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                  color: 'var(--color-text)',
                  wordBreak: 'break-all',
                  lineHeight: 1.5,
                  minHeight: '52px',
                }}
              >
                {output}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={handleGenerate}
                  title="Regenerate"
                  style={{
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: 'rgba(245,245,245,0.5)',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={copyOutput}
                  title="Copy"
                  style={{
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: copied ? 'rgba(22,163,74,0.15)' : 'transparent',
                    color: copied ? '#16a34a' : 'rgba(245,245,245,0.5)',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            {/* Strength meter (passwords only) */}
            {mode === 'password' && strength && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'width 250ms, background 250ms' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bulk generate */}
        <div style={{ ...GLASS, marginBottom: '2rem' }}>
          <label style={LABEL}>Bulk Generate</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {([1, 5, 10, 20] as BulkCount[]).map(n => (
              <button key={n} onClick={() => setBulkCount(n)} style={bulkCount === n ? TOGGLE_ACTIVE : TOGGLE_BASE}>
                {n}
              </button>
            ))}
            <NxButton variant="ghost" size="sm" onClick={handleBulk}>
              Generate {bulkCount}
            </NxButton>
          </div>

          {bulkList.length > 0 && (
            <>
              <div
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  marginBottom: '0.75rem',
                }}
              >
                {bulkList.map((pw, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(10,10,10,0.4)',
                      padding: '0.4rem 0.75rem',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--color-text)',
                        wordBreak: 'break-all',
                      }}
                    >
                      {pw}
                    </span>
                    <button
                      onClick={() => copyBulkRow(i)}
                      style={{
                        flexShrink: 0,
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent',
                        color: bulkCopied === i ? '#16a34a' : 'rgba(245,245,245,0.4)',
                        cursor: 'pointer',
                      }}
                    >
                      {bulkCopied === i ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>
              <NxButton variant="ghost" size="sm" onClick={copyAllBulk}>
                {bulkAllCopied ? 'Copied All!' : 'Copy All'}
              </NxButton>
            </>
          )}
        </div>

        <ToolCTA />
      </div>
    </main>
  );
}
