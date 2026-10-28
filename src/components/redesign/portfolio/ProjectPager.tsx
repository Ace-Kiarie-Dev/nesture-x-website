import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PagerItem = { id: string; title: string } | null;

type ProjectPagerProps = {
  prev: PagerItem;
  next: PagerItem;
  /** 1-based position within the category, as in the grid. */
  position: number;
  total: number;
};

// Slim pager directly under the media: previous / next project in the same category,
// in grid order, no wrap-around (ends are disabled). Desktop shows the titles; phones
// show arrow buttons only. Labelled "Project" so it reads apart from the PDF page controls.
export default function ProjectPager({ prev, next, position, total }: ProjectPagerProps) {
  const side = (item: PagerItem, dir: 'prev' | 'next') => {
    const label = dir === 'prev' ? 'Previous' : 'Next';
    const icon = dir === 'prev' ? <ChevronLeft size={18} aria-hidden="true" /> : <ChevronRight size={18} aria-hidden="true" />;
    const text = (
      <span className="nxpf-pager-text">
        <span className="nxpf-pager-dir">{label}</span>
        {item && <span className="nxpf-pager-title">{item.title}</span>}
      </span>
    );
    const cls = `nx-clay-btn nx-clay-btn-ghost nxpf-pager-btn nxpf-pager-btn--${dir}`;
    if (!item) {
      return (
        <span className={cls} aria-disabled="true">
          {dir === 'prev' && icon}
          {text}
          {dir === 'next' && icon}
        </span>
      );
    }
    return (
      <Link href={`/portfolio/${item.id}`} className={cls} aria-label={`${label} project: ${item.title}`}>
        {dir === 'prev' && icon}
        {text}
        {dir === 'next' && icon}
      </Link>
    );
  };

  return (
    <nav className="nxpf-pager" aria-label="Project">
      {side(prev, 'prev')}
      <span className="nxpf-pager-count">
        {position} / {total}
      </span>
      {side(next, 'next')}
    </nav>
  );
}
