import type { CSSProperties, ReactNode } from 'react';

// Shared by the NX and BetLedger policy views so both linkify identically.

const LINK_PATTERN = /(https?:\/\/[^\s]+(?<![.,;:!?)]))|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

export function linkifyText(text: string, keyPrefix: string, linkClassName: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let linkIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const value = match[0];
    const href = match[1] ? value : `mailto:${value}`;
    parts.push(
      <a
        key={`${keyPrefix}-link-${linkIndex++}`}
        href={href}
        className={linkClassName}
      >
        {value}
      </a>
    );
    lastIndex = LINK_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function renderParagraphs(
  text: string,
  keyPrefix: string,
  options: { style?: CSSProperties; className?: string; linkClassName: string }
) {
  return text.split('\n\n').map((paragraph, i) => (
    <p key={`${keyPrefix}-p-${i}`} style={options.style} className={options.className}>
      {linkifyText(paragraph, `${keyPrefix}-${i}`, options.linkClassName)}
    </p>
  ));
}
