import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { privacyPolicies } from '@/lib/legal/privacy-policies';

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
      <div
        className="w-full border border-white/10 backdrop-blur-md"
        style={{
          maxWidth: '48rem',
          background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
        }}
      >
        <div className="px-6 py-10 sm:px-12 sm:py-14">
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

          <div className="mt-10 space-y-8">
            {policy.sections.map((section) => (
              <div key={section.heading}>
                <h2
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    letterSpacing: '0.03em',
                    color: 'var(--color-primary)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {section.heading}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'rgba(245,245,245,0.7)',
                  }}
                >
                  {section.body}
                </p>
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
        </div>
      </div>
    </main>
  );
}
