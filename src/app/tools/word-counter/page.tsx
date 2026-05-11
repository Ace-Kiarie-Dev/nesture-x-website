'use client';

import { useState, useMemo } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Stop words ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','and','but','or','nor','for','yet','so','at','by','in','of',
  'on','to','up','as','is','it','its','be','was','are','were','been','being',
  'have','has','had','do','does','did','will','would','shall','should','may',
  'might','must','can','could','this','that','these','those','i','me','my',
  'we','our','you','your','he','him','his','she','her','they','them','their',
  'what','which','who','whom','with','from','into','then','than','when','where',
  'while','if','not','no','more','also','just','all','any','both','each','few',
  'how','about','above','after','before','between','during','through','without',
  'because','although','however','therefore','thus','since','until','unless',
  'very','too','quite','rather','such','own','same','other','another','there',
  'here','now','only','even','still','back','well','down','out','off','over',
]);

// ── Stats ────────────────────────────────────────────────────────────────────

interface Stats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  uniqueWords: number;
}

function computeStats(text: string): Stats {
  const words = text.trim() === '' ? 0 : (text.match(/\b\w+\b/g) ?? []).length;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]*[.!?]+(\s|$)/g) ?? []).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readMins = Math.ceil(words / 200);
  const speakMins = Math.ceil(words / 130);
  const readingTime = words === 0 ? '0 min' : readMins < 1 ? '< 1 min' : `${readMins} min`;
  const speakingTime = words === 0 ? '0 min' : speakMins < 1 ? '< 1 min' : `${speakMins} min`;
  const wordTokens = (text.toLowerCase().match(/\b[a-z]+\b/g) ?? []);
  const uniqueWords = new Set(wordTokens).size;
  return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, uniqueWords };
}

// ── Keyword density ──────────────────────────────────────────────────────────

interface KeywordEntry {
  word: string;
  count: number;
  pct: number;
}

function computeKeywords(text: string): KeywordEntry[] {
  const tokens = (text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? []).filter(w => !STOP_WORDS.has(w));
  if (tokens.length === 0) return [];
  const freq: Record<string, number> = {};
  for (const w of tokens) freq[w] = (freq[w] ?? 0) + 1;
  const total = tokens.length;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count, pct: (count / total) * 100 }));
}

// ── Highlight mode ────────────────────────────────────────────────────────────

function buildHighlightHtml(text: string): string {
  const tokens = (text.toLowerCase().match(/\b[a-z]+\b/g) ?? []);
  const freq: Record<string, number> = {};
  for (const w of tokens) freq[w] = (freq[w] ?? 0) + 1;
  const repeated = new Set(Object.entries(freq).filter(([, c]) => c >= 3).map(([w]) => w));

  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(/\b([a-zA-Z]+)\b/g, (match) => {
    if (repeated.has(match.toLowerCase())) {
      return `<span style="background:rgba(26,111,212,0.25);border-radius:2px;padding:0 2px">${match}</span>`;
    }
    return match;
  });
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [charLimit, setCharLimit] = useState('');
  const [highlight, setHighlight] = useState(false);

  const stats = useMemo(() => computeStats(text), [text]);
  const keywords = useMemo(() => computeKeywords(text), [text]);
  const limitNum = parseInt(charLimit, 10);
  const limitValid = !isNaN(limitNum) && limitNum > 0;
  const limitPct = limitValid ? Math.min((text.length / limitNum) * 100, 100) : 0;
  const limitColor = limitPct > 95 ? '#dc2626' : limitPct > 80 ? '#d97706' : '#16a34a';
  const highlightHtml = useMemo(() => (highlight ? buildHighlightHtml(text) : ''), [highlight, text]);

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Chars (w/ spaces)', value: stats.charsWithSpaces },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: stats.readingTime },
    { label: 'Speaking Time', value: stats.speakingTime },
    { label: 'Unique Words', value: stats.uniqueWords },
  ];

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
        WORD & CHARACTER COUNTER
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
        Count words, characters, sentences, and more. Analyse keyword density and check character limits instantly.
      </p>

      <div style={{ maxWidth: '900px' }}>
        {/* Textarea + options */}
        <div style={{ ...GLASS, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{ ...LABEL, marginBottom: 0, flex: '0 0 auto' }}>Your Text</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <button
                onClick={() => setHighlight(h => !h)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.75rem',
                  border: '1px solid',
                  borderColor: highlight ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
                  background: highlight ? 'rgba(26,111,212,0.15)' : 'transparent',
                  color: highlight ? 'var(--color-primary)' : 'rgba(245,245,245,0.4)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {highlight ? 'Highlighting ON' : 'Highlight Repeated'}
              </button>
              {text.length > 0 && (
                <button
                  onClick={() => setText('')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.75rem',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: 'rgba(245,245,245,0.35)',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {!highlight ? (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste or type your text here…"
              style={{
                width: '100%',
                minHeight: '300px',
                resize: 'vertical',
                background: 'rgba(10,10,10,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: highlightHtml || '<span style="opacity:0.3">Paste or type your text here…</span>' }}
              style={{
                width: '100%',
                minHeight: '300px',
                background: 'rgba(10,10,10,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Character limit */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{ ...LABEL, marginBottom: 0, flex: '0 0 auto' }}>Char limit</label>
            <input
              type="number"
              min={1}
              value={charLimit}
              onChange={e => setCharLimit(e.target.value)}
              placeholder="e.g. 280"
              style={{
                width: '110px',
                background: 'rgba(10,10,10,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.4rem 0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
            {limitValid && (
              <div style={{ flex: 1, minWidth: '140px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(245,245,245,0.4)' }}>
                    {text.length} / {limitNum}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: limitColor }}>
                    {Math.round(limitPct)}%
                  </span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${limitPct}%`, background: limitColor, transition: 'width 100ms, background 200ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <style>{`
          .wc-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem;margin-bottom:1.5rem}
          @media(min-width:640px){.wc-stats{grid-template-columns:repeat(4,1fr)}}
        `}</style>
        <div className="wc-stats">
          {statCards.map(card => (
            <div
              key={card.label}
              style={{
                ...GLASS,
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <span style={{ ...LABEL, marginBottom: 0 }}>{card.label}</span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: 1,
                  color: 'var(--color-text)',
                }}
              >
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Keyword density */}
        {keywords.length > 0 && (
          <div style={{ ...GLASS, marginBottom: '2rem' }}>
            <label style={LABEL}>Top Keywords</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {keywords.map(kw => (
                <div key={kw.word} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--color-text)',
                      minWidth: '100px',
                    }}
                  >
                    {kw.word}
                  </span>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(kw.pct * 4, 100)}%`,
                        background: 'var(--color-primary)',
                        minWidth: '4px',
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(245,245,245,0.4)', minWidth: '60px', textAlign: 'right' }}>
                    {kw.count}× · {kw.pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ToolCTA />
      </div>
    </main>
  );
}
