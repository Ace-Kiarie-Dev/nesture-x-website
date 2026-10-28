'use client';

import { useState, useMemo } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';

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
    <ToolShell
      title="Word & Character Counter"
      outline="Counter"
      description="Count words, characters, sentences, and more. Analyse keyword density and check character limits instantly."
      cta
    >
      <div className="nxtl-stack">
        {/* Text + options */}
        <div className="nxtl-panel nx-clay">
          <div className="nxtl-wc-head">
            <label htmlFor="wc-text" className="nxtl-label" style={{ marginBottom: 0 }}>Your Text</label>
            <div className="nxtl-wc-tools">
              <button
                type="button"
                onClick={() => setHighlight(h => !h)}
                aria-pressed={highlight}
                className="nxtl-chip-btn"
              >
                {highlight ? 'Highlighting ON' : 'Highlight Repeated'}
              </button>
              {text.length > 0 && (
                <button type="button" onClick={() => setText('')} className="nxtl-link-btn">
                  Clear
                </button>
              )}
            </div>
          </div>

          {!highlight ? (
            <textarea
              id="wc-text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste or type your text here…"
              className="nx-input nx-textarea nxtl-wc-box"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: highlightHtml || '<span style="opacity:0.3">Paste or type your text here…</span>' }}
              className="nx-input nxtl-wc-box nxtl-wc-highlight"
            />
          )}

          {/* Character limit */}
          <div className="nxtl-wc-limit">
            <label htmlFor="wc-limit" className="nxtl-label" style={{ marginBottom: 0 }}>Char limit</label>
            <input
              id="wc-limit"
              type="number"
              min={1}
              value={charLimit}
              onChange={e => setCharLimit(e.target.value)}
              placeholder="e.g. 280"
              className="nx-input nxtl-wc-limit-input"
            />
            {limitValid && (
              <div className="nxtl-wc-meter">
                <div className="nxtl-range-head">
                  <span className="nxtl-mono">{text.length} / {limitNum}</span>
                  <span className="nxtl-mono" style={{ color: limitColor }}>{Math.round(limitPct)}%</span>
                </div>
                <div className="nxtl-progress">
                  <span style={{ width: `${limitPct}%`, background: limitColor }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="nxtl-stats nxtl-stats--4" aria-live="polite">
          {statCards.map(card => (
            <div key={card.label} className="nxtl-stat">
              <span className="nxtl-stat-label">{card.label}</span>
              <span className="nxtl-stat-num">{card.value}</span>
            </div>
          ))}
        </div>

        {/* Keyword density */}
        {keywords.length > 0 && (
          <div className="nxtl-panel nx-clay">
            <span className="nxtl-label">Top Keywords</span>
            <div className="nxtl-kw-list">
              {keywords.map(kw => (
                <div key={kw.word} className="nxtl-kw">
                  <span className="nxtl-kw-word">{kw.word}</span>
                  <div className="nxtl-progress nxtl-kw-bar">
                    <span style={{ width: `${Math.min(kw.pct * 4, 100)}%`, minWidth: '4px' }} />
                  </div>
                  <span className="nxtl-mono nxtl-kw-num">{kw.count}× · {kw.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
