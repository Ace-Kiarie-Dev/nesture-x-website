// Infinite ticker between the hero and the first section. Pure CSS: the track holds the
// list twice and slides by half its width. Hover pauses it; reduced motion stops it.
const ITEMS = [
  'Web Development',
  'Brand Identity',
  'M-Pesa Integration',
  'Digital Marketing',
  'Full-Stack Applications',
  'Graphic Design',
  'Nairobi Made',
  'World Class',
];

export default function HomeMarquee() {
  return (
    <div className="nxhp-marquee">
      <div className="nxhp-marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="nxhp-marquee-list" aria-hidden={copy === 1 ? true : undefined}>
            {ITEMS.map((item) => (
              <li key={item} className="nxhp-marquee-item">
                {item}
                <span className="nxhp-marquee-dot" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
