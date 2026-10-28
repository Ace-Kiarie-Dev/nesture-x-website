import { cx } from './cx';

type TickerProps = {
  items: string[];
  /** 'brands' sets the items as large display-type names instead of mono labels. */
  variant?: 'labels' | 'brands';
  /** Accessible name; when set the ticker takes focus, which pauses it. */
  label?: string;
  className?: string;
};

// Infinite ticker. Pure CSS (hybrid.css): the track holds the list twice and slides by
// half its width; the second copy is aria-hidden. Hover or focus pauses it; reduced
// motion shows one static, wrapped copy.
export default function Ticker({ items, variant = 'labels', label, className }: TickerProps) {
  return (
    <div
      className={cx('nx-ticker', variant === 'brands' && 'nx-ticker--brands', className)}
      {...(label ? { role: 'region', 'aria-label': label, tabIndex: 0 } : {})}
    >
      <div className="nx-ticker-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="nx-ticker-list" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <li key={item} className="nx-ticker-item">
                {item}
                <span className="nx-ticker-dot" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
