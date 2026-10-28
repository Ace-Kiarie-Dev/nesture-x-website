import type { ReactNode } from 'react';
import Link from 'next/link';
import { ClayButton, Eyebrow } from '@/components/redesign';

type ToolShellProps = {
  /** Tool name as shown in the H1 (Bebas). */
  title: string;
  /** The word of the title drawn as blue outline. */
  outline?: string;
  description: string;
  /** The "custom tool" band under the tool (the old ToolCTA), for tools that had it. */
  cta?: boolean;
  children: ReactNode;
};

function renderTitle(title: string, outline?: string): ReactNode {
  if (!outline) return title;
  const at = title.indexOf(outline);
  if (at === -1) return title;
  return (
    <>
      {title.slice(0, at)}
      <span className="nx-outline">{outline}</span>
      {title.slice(at + outline.length)}
    </>
  );
}

// Page frame for every /tools/* page: slim header (eyebrow, H1, one line, back link),
// then the tool itself, then optionally the custom-tool band. Compact so the tool is on
// screen without scrolling on desktop. No ribbons here (hub only).
export default function ToolShell({ title, outline, description, cta = false, children }: ToolShellProps) {
  return (
    <main className="nxtl nxtl-page">
      <div className="nxtl-wrap">
        <header className="nxtl-head">
          <Link href="/tools" className="nxtl-back">
            <span aria-hidden="true">←</span> All tools
          </Link>
          <Eyebrow>Free tools</Eyebrow>
          <h1 className="nxtl-title">{renderTitle(title, outline)}</h1>
          <p className="nxtl-desc">{description}</p>
        </header>

        <div className="nxtl-body">{children}</div>

        {cta && (
          <aside className="nxtl-cta nx-glass" aria-label="Custom tools">
            <div className="nxtl-cta-copy">
              <p className="nxtl-cta-label">Custom tools</p>
              <p className="nxtl-cta-text">Need a custom tool like this built for your business? Let&apos;s talk.</p>
            </div>
            <ClayButton href="/contact" variant="ghost" className="nx-clay-btn--sm">
              Get in touch
            </ClayButton>
          </aside>
        )}
      </div>
    </main>
  );
}
