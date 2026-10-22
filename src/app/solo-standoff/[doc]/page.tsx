import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import {
  SOLO_STANDOFF_DOCS,
  isSoloStandoffDoc,
  loadSoloStandoffDoc,
} from '@/lib/legal/soloStandoff';

// Only the three legal pages exist under /solo-standoff/[doc].
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SOLO_STANDOFF_DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  if (!isSoloStandoffDoc(doc)) return {};
  const loaded = await loadSoloStandoffDoc(doc);
  const title = loaded?.title ?? SOLO_STANDOFF_DOCS[doc];
  return {
    title: { absolute: `${title} | Solo Standoff` },
    description: `${title} for Solo Standoff, a puzzle game by Nesture-X.`,
    alternates: { canonical: `/solo-standoff/${doc}` },
  };
}

export default async function SoloStandoffLegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!isSoloStandoffDoc(doc)) notFound();
  const loaded = await loadSoloStandoffDoc(doc);
  if (!loaded) notFound();

  return (
    <main className="ss-legal">
      <div className="ss-legal-inner">
        <Link href="/solo-standoff" className="ss-legal-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Solo Standoff
        </Link>
        <header className="ss-legal-head">
          <span className="ss-eyebrow">Solo Standoff</span>
          <h1 className="ss-h2">{loaded.title}</h1>
          {loaded.lastUpdated && <p className="ss-legal-updated">Last updated: {loaded.lastUpdated}</p>}
        </header>
        <article className="ss-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{loaded.body}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
