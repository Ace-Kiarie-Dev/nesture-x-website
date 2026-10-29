import type { LucideIcon } from 'lucide-react';

// One product landing page = one ProductLandingConfig (src/data/product-landings/).
// ProductLanding renders it; productSeo builds the page's metadata and JSON-LD from it.

export interface ProductImage {
  src: string;
  /** Intrinsic pixel size. Images are never drawn larger than this at 1x. */
  width: number;
  height: number;
  /** Empty string for decorative images. */
  alt: string;
}

export interface ProductTheme {
  /** CSS colours. Every product colour on the page comes from these. */
  colors: {
    /** Page background. */
    bg: string;
    /** Cards, form field, FAQ items. */
    surface: string;
    /** Soft tint for alternate sections and icon tiles. */
    tint: string;
    /** Body text. */
    text: string;
    /** Secondary text. Must still pass 4.5:1 on bg and surface. */
    muted: string;
    /** Brand colour: headings, the verse band, and buttons unless action is set. */
    primary: string;
    /** Text and icons on primary (and on action). */
    onPrimary: string;
    /** Buttons, links, focus rings and feature icons, when the brand keeps them apart
        from its identity colour. Defaults to primary. */
    action?: string;
    /** Secondary brand colour, used for decoration and on primary. */
    accent: string;
    /** Highlight colour (rules, dots, the pill dot). Decorative only. */
    highlight: string;
    /** Hairlines and card borders. */
    border: string;
    /** Form error text. */
    danger: string;
  };
  /** font-family values, usually a next/font variable plus fallbacks. */
  fontHeading: string;
  fontBody: string;
  /** Corner radius for cards and fields, and a larger one for panels. */
  radius: string;
  radiusLg: string;
}

export interface ProductLandingConfig {
  /** URL slug (/<slug>) and the launch list's projectSlug. */
  slug: string;
  /** Product name: the wordmark, the launch list's projectName, headings. */
  name: string;
  /** Picks the screen frame (phones or a laptop) and the JSON-LD type. */
  platform: 'mobile' | 'web';
  /** Theme class for product-specific CSS, e.g. 'theme-hikarani'. Optional. */
  themeClass?: string;
  theme: ProductTheme;

  brand: {
    /** The mark next to the wordmark. */
    logo: ProductImage;
    /** App icon, shown on the final section. */
    icon?: ProductImage;
  };

  seo: {
    title: string;
    description: string;
    keywords: string[];
    /** Social card, absolute path from /public. */
    ogImage: ProductImage;
    /** schema.org applicationCategory, e.g. 'LifestyleApplication'. */
    applicationCategory: string;
    /** Only once known, e.g. 'Android'. Left out of JSON-LD when undefined. */
    operatingSystem?: string;
  };

  hero: {
    status: string;
    eyebrow: string;
    headline: string;
    subline: string;
    intro: string;
    /** One under the form. Plain text; a privacy policy link is added after it. */
    formNote: string;
    /** Phone screens (mobile) or one screenshot (web). The first is in front. */
    screens: ProductImage[];
  };

  /** The problem or promise band right under the hero. */
  promise:
    | { kind: 'quote'; text: string; cite: string }
    | { kind: 'statement'; eyebrow: string; title: string; body: string };

  features: {
    eyebrow: string;
    title: string;
    items: { Icon: LucideIcon; title: string; body: string }[];
  };

  steps: {
    eyebrow: string;
    title: string;
    items: { title: string; body: string }[];
  };

  screens: {
    eyebrow: string;
    title: string;
    items: { image: ProductImage; caption: string }[];
  };

  values: {
    eyebrow: string;
    title: string;
    items: string[];
    /** Closing line under the checklist. */
    closing?: string;
  };

  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };

  final: {
    title: string;
    body: string;
  };

  /** Closing "Built by Nesture-X" line. */
  builtBy: string;
}
