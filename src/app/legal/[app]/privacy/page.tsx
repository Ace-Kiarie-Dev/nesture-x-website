import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { privacyPolicies } from '@/lib/legal/privacy-policies';
import PrivacyCard from './PrivacyCard';
import './privacy.css';

const LINK_PATTERN = /(https?:\/\/[^\s]+(?<![.,;:!?)]))|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function linkifyText(text: string, keyPrefix: string): ReactNode[] {
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
        className="nx-privacy-link"
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

function renderParagraphs(text: string, keyPrefix: string, style: React.CSSProperties) {
  return text.split('\n\n').map((paragraph, i) => (
    <p key={`${keyPrefix}-p-${i}`} style={style}>
      {linkifyText(paragraph, `${keyPrefix}-${i}`)}
    </p>
  ));
}

export async function generateStaticParams() {
  return privacyPolicies.map((p) => ({ app: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ app: string }>;
}): Promise<Metadata> {
  const { app } = await params;
  const policy = privacyPolicies.find((p) => p.slug === app);
  if (!policy) return {};

  return {
    title: `${policy.appName} Privacy Policy | Nesture-X`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function NxPrivPolicyPage({
  params,
}: {
  params: Promise<{ app: string }>;
}) {
  const { app } = await params;
  const policy = privacyPolicies.find((p) => p.slug === app);
  if (!policy) notFound();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-8"
      style={{ background: 'var(--color-bg)' }}
    >
      <PrivacyCard>
        <h1
          className="uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 0.95,
            color: 'var(--color-text)',
          }}
        >
          {policy.appName}
        </h1>
        <p
          className="mt-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            color: 'rgba(245,245,245,0.45)',
          }}
        >
          {policy.platform}
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
            color: 'rgba(245,245,245,0.35)',
          }}
        >
          Last updated: {policy.lastUpdated}
        </p>

        {policy.intro && (
          <div className="mt-8" style={{ marginBottom: '2rem' }}>
            {renderParagraphs(policy.intro, 'intro', {
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              fontWeight: 500,
              lineHeight: 1.8,
              color: 'rgba(245,245,245,0.9)',
              marginBottom: '1.5rem',
            })}
          </div>
        )}

        <div className="mt-10">
          {policy.sections.map((section) => (
            <div key={section.heading} style={{ marginBottom: '2rem' }}>
              <h2
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  letterSpacing: '0.05em',
                  color: 'var(--color-primary)',
                  marginBottom: '0.6rem',
                }}
              >
                {section.heading}
              </h2>
              <div className="space-y-3">
                {renderParagraphs(section.body, section.heading, {
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: 'rgba(245,245,245,0.7)',
                })}
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-12 border-t border-white/10 pt-6"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            letterSpacing: '0.02em',
            color: 'var(--color-primary)',
          }}
        >
          {policy.contactEmail}
        </p>
      </PrivacyCard>
    </main>
  );
}
