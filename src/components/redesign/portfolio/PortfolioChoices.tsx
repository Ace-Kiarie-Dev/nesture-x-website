import Image from 'next/image';
import Link from 'next/link';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { Chip } from '@/components/redesign';

export type Choice = {
  href: string;
  title: string;
  line: string;
  count: number;
  art: Asset3dKey;
};

// Two large choice cards: /portfolio (Design work | Digital products) and
// ?view=digital (Web apps | Mobile apps). The whole card is one link. Stacked on phones.
export default function PortfolioChoices({ choices, label }: { choices: Choice[]; label: string }) {
  return (
    <nav className="nxpf-choices" aria-label={label}>
      <ul className="nxpf-choices-list">
        {choices.map((c, i) => {
          const art = ASSETS_3D[c.art];
          return (
            <li key={c.href}>
              <Link href={c.href} className="nxpf-choice nx-clay">
                <span className="nxpf-choice-art" aria-hidden="true">
                  <span className="nxpf-choice-glow" />
                  <Image
                    src={art.src}
                    alt=""
                    width={art.width}
                    height={art.height}
                    sizes="(min-width: 768px) 260px, 200px"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="nxpf-choice-img"
                  />
                </span>
                <span className="nxpf-choice-body">
                  <span className="nxpf-choice-title">{c.title}</span>
                  <span className="nxpf-choice-line">{c.line}</span>
                  <span className="nxpf-choice-foot">
                    <Chip variant="blue" className="nxpf-count">
                      {c.count} projects
                    </Chip>
                    <span className="nxpf-choice-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
