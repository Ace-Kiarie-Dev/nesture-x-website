import Image from 'next/image';
import { SOLO_STANDOFF_PLAY_URL } from '@/constants';

// Pre-launch this is a "Coming soon" chip. Setting SOLO_STANDOFF_PLAY_URL in
// constants swaps in the official Google Play badge, linked to the listing.
export default function PlayBadge() {
  if (SOLO_STANDOFF_PLAY_URL) {
    return (
      <a href={SOLO_STANDOFF_PLAY_URL} target="_blank" rel="noopener noreferrer" className="ss-play-badge">
        <Image
          src="/images/badges/google-play.png"
          alt="Get Solo Standoff on Google Play"
          width={646}
          height={250}
        />
      </a>
    );
  }

  return (
    <p className="ss-soon-badge">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M4 2.8v18.4c0 .5.5.8.9.6L20.3 12.6c.4-.2.4-.9 0-1.1L4.9 2.2C4.5 2 4 2.3 4 2.8Z" fill="currentColor" />
      </svg>
      <span>
        <small>Coming soon to</small>
        Google Play
      </span>
    </p>
  );
}
