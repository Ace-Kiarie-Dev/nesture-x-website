'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Image as LucideImage, Minimize2, QrCode, FileText, Palette } from 'lucide-react';

const TOOLS = [
  {
    icon: LucideImage,
    name: 'Image Converter',
    description: 'Convert images between JPG, PNG, and WebP instantly.',
    href: '/tools/image-converter',
  },
  {
    icon: Minimize2,
    name: 'Image Compressor',
    description: 'Reduce image file size without sacrificing quality.',
    href: '/tools/image-compressor',
  },
  {
    icon: QrCode,
    name: 'QR Code Generator',
    description: 'Generate QR codes for any URL or text in seconds.',
    href: '/tools/qr-generator',
  },
  {
    icon: FileText,
    name: 'Invoice Generator',
    description: 'Create and download professional PDF invoices for free.',
    href: '/tools/invoice-generator',
  },
  {
    icon: Palette,
    name: 'Color Palette Generator',
    description: 'Generate beautiful colour palettes from any base colour.',
    href: '/tools/color-palette',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
};

export default function ToolsGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-5"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <motion.div key={tool.href} variants={cardVariant}>
            <Link
              href={tool.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                height: '100%',
                background: 'rgba(20, 25, 32, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                transition: 'box-shadow 180ms ease, border-color 180ms ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '4px 4px 0 var(--color-primary)';
                el.style.borderColor = 'rgba(26,111,212,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'none';
                el.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(26,111,212,0.25)',
                  background: 'rgba(26,111,212,0.08)',
                  color: 'var(--color-primary)',
                }}
              >
                <Icon size={20} />
              </div>

              {/* Name */}
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1.3,
                }}
              >
                {tool.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: 'rgba(245,245,245,0.5)',
                  flex: 1,
                }}
              >
                {tool.description}
              </p>

              {/* CTA label */}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                }}
              >
                Use Tool →
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
