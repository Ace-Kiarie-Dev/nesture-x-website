import type { CSSProperties } from 'react';
import { Band, Chip, SectionHeading } from '@/components/redesign';

type Group = { label: string; items: string[] };

// Everything used across Nesture-X work, grouped. Labels that were on the old list keep
// their exact wording; FEATURED (the old list's headline stack) keeps the blue chip.
// Mobile (React Native, Expo) is folded into Frontend: two chips are too few for a group.
const GROUPS: Group[] = [
  { label: 'Languages', items: ['TypeScript', 'Vanilla JavaScript', 'HTML5/CSS3', 'Kotlin', 'Python'] },
  {
    label: 'Frontend & mobile',
    items: [
      'Next.js',
      'React',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'Bootstrap 5',
      'SwiperJS',
      'shadcn/ui',
      'Alpine.js',
      'HTMX',
      'React Native',
      'Expo',
    ],
  },
  { label: 'Games & motion', items: ['HTML5 Canvas', 'matter-js', 'React Native Skia'] },
  {
    label: 'Backend & data',
    items: ['Node.js', 'Express', 'MongoDB Atlas', 'Mongoose', 'Supabase', 'SQLite', 'Firebase (Auth & Hosting)'],
  },
  {
    label: 'Payments & messaging',
    items: ['M-Pesa Daraja API (STK Push)', 'Resend', 'WhatsApp Integration', 'Calendly'],
  },
  { label: 'Documents & media', items: ['react-pdf', 'pdf-lib', 'PDF.js', 'sharp'] },
  { label: 'Desktop & scripting', items: ['PyMuPDF', 'pyttsx3', 'PyInstaller'] },
  { label: 'Hosting & DevOps', items: ['Vercel', 'Netlify', 'Railway', 'Render', 'GitHub'] },
  { label: 'Design Tools', items: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'] },
];

const FEATURED = new Set([
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'MongoDB Atlas',
  'M-Pesa Daraja API (STK Push)',
  'Railway',
  'Netlify',
  'Vercel',
]);

const PROJECTS = [
  'ODU Active',
  'Vicking Ventures',
  'MR Right',
  'SHINKUSEN',
  'BetLedger',
  'Kikota',
  'Matatu Dash',
  'Solo Standoff',
  'SoraPesa',
  'Readout',
  'NX Admin',
];

export default function HomeStack() {
  return (
    <Band variant="slate" aria-labelledby="nxhp-stack-title">
      <SectionHeading
        id="nxhp-stack-title"
        eyebrow="Technologies"
        title="THE STACK"
        outline="STACK"
        className="nxhp-reveal"
      />

      <div className="nxhp-stack-groups">
        {GROUPS.map((group, i) => (
          <div key={group.label} className="nxhp-stack-group nxhp-reveal" style={{ '--i': i % 3 } as CSSProperties}>
            <p id={`nxhp-stack-${i}`} className="nxhp-tools-label">
              {group.label}
            </p>
            <ul className="nxhp-chips" aria-labelledby={`nxhp-stack-${i}`}>
              {group.items.map((tech) => (
                <li key={tech}>
                  <Chip variant={FEATURED.has(tech) ? 'blue' : 'default'}>{tech}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="nxhp-stack-used nxhp-reveal">Used across: {PROJECTS.join(' · ')}</p>
    </Band>
  );
}
