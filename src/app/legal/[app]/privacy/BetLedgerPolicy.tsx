import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import type { PrivacyPolicy } from '@/lib/legal/privacy-policies';
import { renderParagraphs } from './renderText';
import '@/components/betledger/betledger.css';

// Inter is BetLedger-only (see src/app/betledger/page.tsx); the variable is
// applied on the themed wrapper so the NX policies never pick it up.
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function BetLedgerPolicy({ policy }: { policy: PrivacyPolicy }) {
  return (
    <div className={`theme-betledger ${inter.variable} min-h-screen`}>
      <main className="bl-policy">
        <Link href="/betledger" className="bl-text-link bl-policy-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to BetLedger
        </Link>

        <header className="bl-policy-letterhead">
          <Image
            src="/images/originals/Bet-ledger-icon.png"
            alt="BetLedger logo"
            width={56}
            height={56}
            className="bl-policy-icon"
            priority
          />
          <h1>
            <span className="bl-policy-brand">BetLedger</span>
            <span className="bl-policy-title">Privacy Policy</span>
          </h1>
        </header>

        <hr className="bl-policy-divider" />

        <p className="bl-policy-meta">
          <span>{policy.platform}</span>
          <span>Last updated: {policy.lastUpdated}</span>
        </p>

        <article className="bl-policy-card bl-glass">
          {policy.intro && (
            <div className="bl-policy-intro">
              {renderParagraphs(policy.intro, 'intro', { linkClassName: 'bl-link' })}
            </div>
          )}

          <ol className="bl-policy-sections">
            {policy.sections.map((section, i) => (
              <li key={section.heading} className="bl-policy-section">
                <h2 className="bl-policy-heading">
                  <span className="bl-policy-num">{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                <div className="bl-policy-body">
                  {renderParagraphs(section.body, section.heading, { linkClassName: 'bl-link' })}
                </div>
              </li>
            ))}
          </ol>

          <p className="bl-policy-contact">
            <a href={`mailto:${policy.contactEmail}`} className="bl-link">{policy.contactEmail}</a>
          </p>
        </article>
      </main>
    </div>
  );
}
