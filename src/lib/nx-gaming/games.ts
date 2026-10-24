// NX Gaming hub data — single source of truth for /nx-gaming (cards, info panel,
// JSON-LD). Values come from the approved mockup in docs/design-reference/.
// Plain (non-'use client') module so the server page and the client hub can both
// import it.

export type GameStatus = 'live' | 'locked';

export interface GameHero {
  src: string;
  // Intrinsic size of the file, for next/image.
  width: number;
  height: number;
}

interface GameBase {
  slug: string;
  name: string;
  // Genre label shown under the name, e.g. "Puzzle".
  kind: string;
  hero: GameHero;
  // Rendered hero width in px on the card: desktop stage and mobile carousel.
  heroWidth: { desktop: number; mobile: number };
  // Card background gradient.
  bg: string;
  // Soft glow layered over the card background.
  glow: string;
  // Accent colour (hex) for the stage glow behind the selected card.
  accent: string;
  tags: readonly string[];
  blurb: string;
}

export interface LiveGame extends GameBase {
  status: 'live';
  // On-site path to the playable game.
  href: string;
  // How to play, worded for a keyboard/mouse device and for a touch screen.
  controls: { desktop: string; mobile: string };
}

export interface LockedGame extends GameBase {
  status: 'locked';
  // On-site landing page for the upcoming game ("Explore" button).
  pageHref: string;
  // Launch-list signup, when the landing page has one ("Get notified" link).
  notifyHref?: string;
}

export type Game = LiveGame | LockedGame;

export const NX_GAMES: readonly Game[] = [
  {
    slug: '2048',
    name: '2048',
    kind: 'Puzzle',
    status: 'live',
    href: '/nx-gaming/2048',
    hero: { src: '/images/NX-Gaming/hero-2048.webp', width: 558, height: 1000 },
    heroWidth: { desktop: 212, mobile: 176 },
    bg: 'linear-gradient(160deg,#8b7bff 0%,#3b2cb0 60%,#1a1450 100%)',
    glow: 'radial-gradient(70% 50% at 50% 38%,rgba(198,243,90,0.35),rgba(198,243,90,0))',
    accent: '#c6f35a',
    tags: ['3×3 to 6×6', 'Works offline', '3 undos'],
    blurb:
      'Slide tiles, merge numbers and chase the 2048 tile. Undo three moves, share a score card, and pick up where you left off.',
    controls: { desktop: 'Arrow keys or swipe', mobile: 'Swipe to play' },
  },
  {
    slug: 'flappy-horror',
    name: 'Flappy Horror',
    kind: 'Arcade',
    status: 'live',
    href: '/nx-gaming/flappy-horror',
    hero: { src: '/images/NX-Gaming/hero-flappy-horror.webp', width: 992, height: 1000 },
    heroWidth: { desktop: 330, mobile: 280 },
    bg: 'linear-gradient(160deg,#1b4a4f 0%,#0b1f22 55%,#05080a 100%)',
    glow: 'radial-gradient(60% 45% at 78% 22%,rgba(227,38,58,0.55),rgba(227,38,58,0)),radial-gradient(60% 40% at 40% 55%,rgba(95,245,209,0.30),rgba(95,245,209,0))',
    accent: '#e3263a',
    tags: ['Souls and Phase', 'Blood Moon', 'Medals'],
    blurb:
      'Guide a little ghost through a graveyard of zombie hands, gather lost souls, phase through the dead and survive the Blood Moon.',
    controls: { desktop: 'Space, click or tap', mobile: 'Tap to flap' },
  },
  {
    slug: 'solo-standoff',
    name: 'Solo Standoff',
    kind: 'Puzzle shooter',
    status: 'locked',
    pageHref: '/solo-standoff',
    hero: { src: '/images/NX-Gaming/hero-solo-standoff.webp', width: 682, height: 1000 },
    heroWidth: { desktop: 250, mobile: 208 },
    bg: 'linear-gradient(160deg,#1a6fd4 0%,#123a7a 55%,#0d1b3e 100%)',
    glow: 'radial-gradient(60% 45% at 60% 40%,rgba(255,198,41,0.40),rgba(255,198,41,0))',
    accent: '#FFC629',
    tags: ['Tap to fire', 'Grid puzzle', 'Mobile first'],
    blurb: 'Tap to fire on a grid and clear the board. Still in development. Follow us to catch the launch.',
  },
  {
    slug: 'matatu-dash',
    name: 'Matatu Dash',
    kind: 'Endless hopper',
    status: 'locked',
    pageHref: '/matatu-dash',
    // The page's closing waitlist form. utm_source is stored with each signup.
    notifyHref: '/matatu-dash?utm_source=nx-gaming-hub#waitlist',
    hero: { src: '/images/NX-Gaming/hero-matatu-dash.webp', width: 625, height: 1000 },
    heroWidth: { desktop: 232, mobile: 192 },
    bg: 'linear-gradient(160deg,#17566a 0%,#0b2a3f 55%,#061423 100%)',
    glow: 'radial-gradient(60% 45% at 50% 40%,rgba(66,222,195,0.40),rgba(66,222,195,0))',
    accent: '#42DEC3',
    tags: ['Hop and dodge', 'Nairobi streets', 'Android first'],
    blurb:
      'Hop. Dodge. Keep going. Cross Nairobi streets packed with matatus, bodabodas and hawkers. Still in development. Follow us to catch the launch.',
  },
];

export const isLive = (game: Game): game is LiveGame => game.status === 'live';

export const LIVE_GAMES: readonly LiveGame[] = NX_GAMES.filter(isLive);
