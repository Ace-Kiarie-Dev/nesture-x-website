import { Band, Chip, SectionHeading } from '@/components/redesign';

const FEATURED = [
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'MongoDB Atlas',
  'M-Pesa Daraja API',
  'Railway',
  'Netlify',
  'Vercel',
];

const REGULAR = [
  'Vanilla JavaScript',
  'HTML5/CSS3',
  'Tailwind CSS',
  'React Native',
  'Framer Motion',
  'Bootstrap 5',
  'Firebase',
  'GitHub',
  'WhatsApp Integration',
];

const DESIGN_TOOLS = ['Adobe Photoshop', 'Adobe Illustrator'];

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

      <ul className="nxhp-chips nxhp-stack-chips nxhp-reveal">
        {FEATURED.map((tech) => (
          <li key={tech}>
            <Chip variant="blue">{tech}</Chip>
          </li>
        ))}
        {REGULAR.map((tech) => (
          <li key={tech}>
            <Chip>{tech}</Chip>
          </li>
        ))}
      </ul>

      {/* Design tools: separated from the dev stack above. */}
      <div className="nxhp-tools nxhp-reveal">
        <p className="nxhp-tools-label">Design Tools</p>
        <ul className="nxhp-chips">
          {DESIGN_TOOLS.map((tool) => (
            <li key={tool}>
              <Chip>{tool}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}
