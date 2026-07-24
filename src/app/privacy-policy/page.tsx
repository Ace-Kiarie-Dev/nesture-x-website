import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nesture-X',
  description:
    'Privacy policy for Nesture-X and the Nesture-X Free Tools Hub. No file storage, no account required. Learn how we handle data and our Google AdSense disclosure.',
  keywords: ['Nesture-X privacy policy'],
  openGraph: {
    title: 'Privacy Policy | Nesture-X',
    description:
      'Privacy policy for Nesture-X and the Nesture-X Free Tools Hub. No file storage, no account required. Learn how we handle data and our Google AdSense disclosure.',
    url: 'https://nesturex.com/privacy-policy',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/privacy-policy.png',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy — Nesture-X',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Nesture-X',
    description:
      'Privacy policy for Nesture-X and the Nesture-X Free Tools Hub. No file storage, no account required. Learn how we handle data and our Google AdSense disclosure.',
    images: ['https://nesturex.com/og/tools/privacy-policy.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/privacy-policy',
  },
};

const SECTION_PAD = 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem)';
const PROSE_WIDTH = '72ch';

const H2_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
  lineHeight: 0.95,
  color: 'var(--color-text)',
  marginBottom: '1.25rem',
  marginTop: '4rem',
  paddingTop: '3rem',
  borderTop: '1px solid rgba(26,111,212,0.12)',
};

const P_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
  lineHeight: 1.9,
  color: 'rgba(245,245,245,0.65)',
  marginBottom: '1.25rem',
};

const MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-primary)',
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* ── Header ── */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />
        <div className="relative z-[1]" style={{ maxWidth: PROSE_WIDTH }}>
          <p style={MONO_LABEL}>Legal</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 10vw, 10rem)',
              lineHeight: 0.87,
              color: 'var(--color-text)',
              margin: '1.5rem 0 2rem',
            }}
          >
            PRIVACY POLICY
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              color: 'rgba(245,245,245,0.35)',
            }}
          >
            Last updated: May 2025
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: 'clamp(4rem, 6vw, 6rem) clamp(2rem, 7vw, 8rem)',
        }}
      >
        <div style={{ maxWidth: PROSE_WIDTH }}>

          <p style={P_STYLE}>
            This Privacy Policy explains how Nesture-X (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and
            protects information when you visit our website at nesture-x.com or use any of our
            free online tools. By using the site you agree to the practices described here.
          </p>

          {/* 1 */}
          <h2 style={H2_STYLE}>1. INFORMATION WE COLLECT</h2>
          <p style={P_STYLE}>
            We do not require you to create an account or provide personal information to use our
            free tools. When you use tools such as the Image Converter, Image Compressor, QR Code
            Generator, Invoice Generator, or Color Palette Generator, any files or data you
            upload or enter are processed entirely within your browser session or in temporary
            server memory and are discarded immediately after the operation completes. We do not
            store, log, or retain any uploaded files or generated outputs.
          </p>
          <p style={P_STYLE}>
            If you submit a contact or booking form on our website, we collect the information
            you voluntarily provide (name, email address, message content) for the sole purpose
            of responding to your enquiry. This data is stored in our secure database and is
            never sold or shared with third parties.
          </p>

          {/* 2 */}
          <h2 style={H2_STYLE}>2. COOKIES AND ANALYTICS</h2>
          <p style={P_STYLE}>
            We may use standard browser cookies to remember site preferences such as your chosen
            colour theme. No tracking cookies are set by Nesture-X itself. If third-party
            analytics or advertising scripts are loaded on the site (see section 4 below), those
            services may set their own cookies governed by their respective privacy policies.
          </p>

          {/* 3 */}
          <h2 style={H2_STYLE}>3. HOW WE USE YOUR INFORMATION</h2>
          <p style={P_STYLE}>
            Information submitted through contact or booking forms is used solely to communicate
            with you and deliver the services you requested. We do not use this information for
            marketing without your explicit consent, and we do not share it with third parties
            except where required by law.
          </p>

          {/* 4 */}
          <h2 style={H2_STYLE}>4. ADVERTISING — GOOGLE ADSENSE</h2>
          <p style={P_STYLE}>
            Once the Nesture-X website reaches the eligibility threshold for monetisation, we
            intend to participate in the Google AdSense programme. At that point, Google may
            serve advertisements on pages of this site. Google, as a third-party vendor, uses
            cookies to serve ads based on a user&apos;s prior visits to this website or other
            websites. Google&apos;s use of advertising cookies enables it and its partners to serve
            ads based on your visit to our site and/or other sites on the internet.
          </p>
          <p style={P_STYLE}>
            You may opt out of personalised advertising by visiting{' '}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88em',
                color: 'var(--color-primary)',
              }}
            >
              google.com/settings/ads
            </span>
            . Until AdSense is activated, no advertising cookies are present on this site.
          </p>

          {/* 5 */}
          <h2 style={H2_STYLE}>5. DATA SECURITY</h2>
          <p style={P_STYLE}>
            We take reasonable measures to protect any personal information you provide. Our
            servers use HTTPS encryption for all data in transit. Contact form submissions are
            stored in an access-controlled database. No method of transmission over the internet
            is 100% secure, and we cannot guarantee absolute security; however, we apply
            industry-standard safeguards to minimise risk.
          </p>

          {/* 6 */}
          <h2 style={H2_STYLE}>6. THIRD-PARTY LINKS</h2>
          <p style={P_STYLE}>
            Our website may contain links to third-party websites (for example, partner or
            portfolio company sites). We are not responsible for the privacy practices of those
            sites and encourage you to read their privacy policies before providing any personal
            information.
          </p>

          {/* 7 */}
          <h2 style={H2_STYLE}>7. CHILDREN&apos;S PRIVACY</h2>
          <p style={P_STYLE}>
            Our services are not directed at children under the age of 13. We do not knowingly
            collect personal information from children. If you believe a child has provided us
            with personal information, please contact us and we will delete it promptly.
          </p>

          {/* 8 */}
          <h2 style={H2_STYLE}>8. CHANGES TO THIS POLICY</h2>
          <p style={P_STYLE}>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date. Continued use of the site after changes
            are posted constitutes your acceptance of the revised policy.
          </p>

          {/* 9 */}
          <h2 style={H2_STYLE}>9. CONTACT US</h2>
          <p style={P_STYLE}>
            If you have any questions or concerns about this Privacy Policy or how your
            information is handled, please contact us at:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
              color: 'var(--color-primary)',
              letterSpacing: '0.04em',
              lineHeight: 1.8,
              marginBottom: '4rem',
            }}
          >
            nesturex@gmail.com<br />
            Nairobi, Kenya
          </p>

        </div>
      </section>
    </main>
  );
}
