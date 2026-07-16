'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function PrivacyCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full relative"
      style={{
        maxWidth: '48rem',
        background: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--color-primary)',
        borderRadius: 0,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          background: 'var(--color-primary)',
        }}
      />
      <div
        style={{
          padding: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
