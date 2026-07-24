'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/ui/Breadcrumb';
import GearsAnimation from '@/components/ui/GearsAnimation';
import ProgressRingAnimation from '@/components/ui/ProgressRingAnimation';
import LaunchListForm from '@/components/sections/LaunchListForm';
import NxButton from '@/components/ui/NxButton';

export interface StatusProject {
  slug: string;
  title: string;
  description: string;
  category: 'web' | 'mobile';
  status: string;
}

const CATEGORY_LABEL: Record<StatusProject['category'], string> = {
  web:    'Web Apps',
  mobile: 'Mobile Apps',
};

function isTestingStatus(status: string): boolean {
  return status.toLowerCase().includes('test');
}

export default function StatusPageClient({ project }: { project: StatusProject }) {
  const router = useRouter();
  const testing = isTestingStatus(project.status);
  const categoryLabel = CATEGORY_LABEL[project.category];
  const categoryHref = `/portfolio?view=digital&type=${project.category}#${project.slug}`;

  return (
    <main className="relative overflow-hidden" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />

      <Breadcrumb
        segments={[
          { label: 'Portfolio', onClick: () => router.push('/portfolio') },
          { label: categoryLabel, onClick: () => router.push(`/portfolio?view=digital&type=${project.category}`) },
          { label: project.title },
        ]}
      />

      <motion.div
        className="relative z-[1]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)',
          gap: '2rem',
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'var(--color-primary)',
          }}
        >
          {testing ? '// IN TESTING' : '// IN DEVELOPMENT'}
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize:   'clamp(3rem, 9vw, 7rem)',
            lineHeight: 0.9,
            color:      'var(--color-text)',
            maxWidth:   '20ch',
          }}
        >
          {project.title.toUpperCase()}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
          {testing ? <ProgressRingAnimation /> : <GearsAnimation />}
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(0.95rem, 1.4vw, 1.1rem)',
            lineHeight: 1.8,
            color:      'rgba(245,245,245,0.55)',
            maxWidth:   '30rem',
          }}
        >
          {testing
            ? "Almost there. This one's in final testing before launch — the finish line is close."
            : "We're building this one right now. Check back soon — it's coming."}
        </p>

        <LaunchListForm projectSlug={project.slug} projectName={project.title} />

        <NxButton variant="ghost" size="sm" onClick={() => router.push(categoryHref)}>
          ← Back to {categoryLabel}
        </NxButton>
      </motion.div>
    </main>
  );
}
