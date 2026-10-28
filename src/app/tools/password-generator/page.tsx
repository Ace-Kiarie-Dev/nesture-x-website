'use client';

import { useState, useCallback, useRef } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented, Toggle } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

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
    <ToolShell
      title="Password Generator"
      outline="Generator"
      description="Generate cryptographically secure passwords and passphrases. All generation happens locally — nothing leaves your browser."
      cta
    >
      <div className="nxtl-panes">

        {/* ── Controls ── */}
        <div className="nxtl-panel nx-clay">
          {/* Mode toggle */}
          <Segmented
            label="Mode"
            className="nxtl-pw-modes"
            options={[
              { value: 'password' as Mode, label: 'Password' },
              { value: 'passphrase' as Mode, label: 'Passphrase' },
            ]}
            value={mode}
            onChange={setMode}
          />

          {mode === 'password' ? (
            <>
              {/* Length */}
              <div>
                <div className="nxtl-range-head">
                  <label htmlFor="pw-length" className="nxtl-label" style={{ marginBottom: 0 }}>Length</label>
                  <span className="nxtl-pw-val">{length}</span>
                </div>
                <input
                  id="pw-length"
                  type="range"
                  min={8}
                  max={128}
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="nxtl-range"
                />
                <div className="nxtl-range-head">
                  <span className="nxtl-mono">8</span>
                  <span className="nxtl-mono">128</span>
                </div>
              </div>

              {/* Character sets */}
              <div>
                <span className="nxtl-label" id="pw-types">Character Types</span>
                <div className="nxtl-pw-types" role="group" aria-labelledby="pw-types">
                  {[
                    { key: 'upper' as const, label: 'Uppercase (A–Z)', active: upper },
                    { key: 'lower' as const, label: 'Lowercase (a–z)', active: lower },
                    { key: 'nums'  as const, label: 'Numbers (0–9)',   active: nums },
                    { key: 'syms'  as const, label: 'Symbols (!@#…)', active: syms },
                  ].map(({ key, label, active }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCharset(key)}
                      aria-pressed={active}
                      className="nxtl-chip-btn nxtl-pw-type"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {charWarn && (
                  <p className="nxtl-pw-warn" role="alert">
                    At least one character type must be selected
                  </p>
                )}
              </div>

              {/* Advanced options */}
              <div className="nxtl-pw-adv">
                <button
                  type="button"
                  onClick={() => setAdvOpen(v => !v)}
                  aria-expanded={advOpen}
                  className="nxtl-utm-history-toggle"
                >
                  <span aria-hidden="true">{advOpen ? '▾' : '▸'}</span> Advanced Options
                </button>

                {advOpen && (
                  <div className="nxtl-pw-adv-body">
                    <Toggle checked={exAmbig} onChange={setExAmbig}>
                      Exclude ambiguous characters (0Oo1lIi)
                    </Toggle>
                    <div className="nx-field">
                      <label htmlFor="pw-exclude">Custom exclude characters</label>
                      <input
                        id="pw-exclude"
                        type="text"
                        value={customEx}
                        onChange={e => setCustomEx(e.target.value)}
                        placeholder="e.g. @#$"
                        className="nx-input nxtl-pw-exclude"
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Word count */}
              <div>
                <div className="nxtl-range-head">
                  <label htmlFor="pw-words" className="nxtl-label" style={{ marginBottom: 0 }}>Word Count</label>
                  <span className="nxtl-pw-val">{wordCount}</span>
                </div>
                <input
                  id="pw-words"
                  type="range"
                  min={3}
                  max={8}
                  value={wordCount}
                  onChange={e => setWordCount(Number(e.target.value))}
                  className="nxtl-range"
                />
                <div className="nxtl-range-head">
                  <span className="nxtl-mono">3</span>
                  <span className="nxtl-mono">8</span>
                </div>
              </div>

              {/* Separator */}
              <div>
                <span className="nxtl-label">Separator</span>
                <Segmented
                  label="Separator"
                  size="sm"
                  options={SEPARATORS.map(sp => ({ value: sp.value, label: sp.label }))}
                  value={separator}
                  onChange={setSeparator}
                />
              </div>

              {/* Toggles */}
              <div className="nxtl-pw-toggles">
                <Toggle checked={capitalise} onChange={setCapitalise}>Capitalise words</Toggle>
                <Toggle checked={includeNum} onChange={setIncludeNum}>Include a number</Toggle>
              </div>
            </>
          )}

          {/* Generate button */}
          <div className="nxtl-actions">
            <ClayButton onClick={handleGenerate}>
              Generate
            </ClayButton>
          </div>
        </div>

        <div className="nxtl-stack">
          {/* Output */}
          <div className="nxtl-panel nx-clay" aria-live="polite">
            {output ? (
              <>
                <span className="nxtl-label" style={{ marginBottom: 0 }}>Generated {mode === 'passphrase' ? 'Passphrase' : 'Password'}</span>
                <div className="nxtl-pw-out">
                  <div className="nxtl-pw-value">
                    {output}
                  </div>
                  <div className="nxtl-pw-out-btns">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      title="Regenerate"
                      aria-label="Regenerate"
                      className="nxtl-pw-icon"
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={copyOutput}
                      title="Copy"
                      aria-label={copied ? 'Copied' : 'Copy'}
                      className={`nxtl-pw-icon${copied ? ' is-copied' : ''}`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Strength meter (passwords only) */}
                {mode === 'password' && strength && (
                  <div className="nxtl-pw-strength">
                    <div className="nxtl-range-head">
                      <span className="nxtl-label" style={{ marginBottom: 0 }}>Strength</span>
                      <span className="nxtl-pw-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="nxtl-progress">
                      <span style={{ width: `${strength.pct}%`, background: strength.color }} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="nxtl-pw-empty">
                <span className="nxtl-pw-empty-dots" aria-hidden="true">••••••••</span>
                <span className="nxtl-hint">Press Generate to create one</span>
              </div>
            )}
          </div>

          {/* Bulk generate */}
          <div className="nxtl-panel nx-clay">
            <span className="nxtl-label" style={{ marginBottom: 0 }}>Bulk Generate</span>
            <div className="nxtl-pw-bulk-head">
              <Segmented
                label="How many"
                size="sm"
                options={([1, 5, 10, 20] as BulkCount[]).map(n => ({ value: String(n), label: n }))}
                value={String(bulkCount)}
                onChange={v => setBulkCount(Number(v) as BulkCount)}
              />
              <ClayButton variant="ghost" className="nx-clay-btn--sm" onClick={handleBulk}>
                Generate {bulkCount}
              </ClayButton>
            </div>

            {bulkList.length > 0 && (
              <>
                <div className="nxtl-pw-bulk-list">
                  {bulkList.map((pw, i) => (
                    <div key={i} className="nxtl-mp-row">
                      <span className="nxtl-pw-bulk-value">
                        {pw}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyBulkRow(i)}
                        aria-label={`Copy item ${i + 1}`}
                        className={`nxtl-mp-copy${bulkCopied === i ? ' is-copied' : ''}`}
                      >
                        {bulkCopied === i ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="nxtl-actions">
                  <ClayButton variant="ghost" className="nx-clay-btn--sm" onClick={copyAllBulk}>
                    {bulkAllCopied ? 'Copied All!' : 'Copy All'}
                  </ClayButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
