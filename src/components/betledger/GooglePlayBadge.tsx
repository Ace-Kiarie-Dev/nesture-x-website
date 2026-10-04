import Image from 'next/image';
import { BETLEDGER_PLAY_URL } from '@/constants';

// Official "Get it on Google Play" badge (646×250, includes Google's clear space).
export default function GooglePlayBadge() {
  return (
    <a
      href={BETLEDGER_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="bl-play-badge"
    >
      <Image
        src="/images/badges/google-play.png"
        alt="Get BetLedger on Google Play"
        width={646}
        height={250}
      />
    </a>
  );
}
