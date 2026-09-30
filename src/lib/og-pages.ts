// Text for each generated share image. Every route's opengraph-image.tsx and
// twitter-image.tsx read from here, so the two images for a page can't drift.
// The 4 product landing pages use their own card images instead.

export interface OgPage {
  title: string;
  subtitle: string;
  eyebrow?: string;
  alt: string;
}

const tool = (title: string, subtitle: string): OgPage => ({
  title,
  subtitle,
  eyebrow: 'FREE TOOL',
  alt: `${title} — free online tool by Nesture-X`,
});

export const OG_PAGES = {
  home: {
    title: 'Creative Technology Agency in Nairobi',
    subtitle: 'Websites, web apps and mobile apps with M-Pesa integration, plus branding, design and printing.',
    alt: 'Nesture-X — creative technology agency in Nairobi',
  },
  about: {
    title: 'About Nesture-X',
    subtitle: 'Design and full-stack development under one roof, building products that grow businesses.',
    alt: 'About Nesture-X',
  },
  services: {
    title: 'Services',
    subtitle: 'Websites, apps, M-Pesa integration, branding, printing and digital marketing for Kenyan businesses.',
    alt: 'Nesture-X services',
  },
  portfolio: {
    title: 'Portfolio',
    subtitle: 'Websites, web apps, logos, company profiles and social media design for Kenyan businesses.',
    alt: 'Nesture-X portfolio',
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Talk to us about your website, app, M-Pesa integration, branding or printing.',
    alt: 'Contact Nesture-X',
  },
  booking: {
    title: 'Book a Consultation',
    subtitle: "Pick a time that suits you and we'll talk through your website, app or brand.",
    alt: 'Book a consultation with Nesture-X',
  },
  tools: {
    title: 'Free Online Tools',
    subtitle: 'Free tools for designers, developers and Kenyan businesses. No sign-up needed.',
    eyebrow: 'FREE TOOLS',
    alt: 'Free online tools by Nesture-X',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    subtitle: 'How Nesture-X and the Free Tools Hub handle your data.',
    alt: 'Nesture-X privacy policy',
  },

  imageStudio:       tool('Image Studio', 'Convert, compress, resize and edit images in your browser.'),
  pdfStudio:         tool('PDF Studio', 'Compress, merge, split, rotate and password protect PDFs.'),
  qrGenerator:       tool('QR Code Generator', 'Custom QR codes with your logo, downloaded as PNG or SVG.'),
  invoiceGenerator:  tool('Invoice Generator', 'Professional PDF invoices with M-Pesa and bank details.'),
  colorPalette:      tool('Color Palette Generator', 'Build colour palettes and export CSS, Tailwind or JSON.'),
  logoTextPreview:   tool('Logo Text Previewer', 'See your brand name in 25 fonts before you commission a logo.'),
  mpesaValidator:    tool('M-Pesa Validator', 'Validate M-Pesa phone, Till and Paybill numbers instantly.'),
  utmBuilder:        tool('UTM Link Builder', 'Build UTM tracking links one at a time or in bulk.'),
  wordCounter:       tool('Word & Character Counter', 'Count words and characters, with reading time and keyword density.'),
  passwordGenerator: tool('Password Generator', 'Secure passwords and passphrases, generated in your browser.'),
  base64Encoder:     tool('Base64 Encoder & Decoder', 'Encode and decode text and files, with a URL-safe mode.'),
} satisfies Record<string, OgPage>;

export type OgPageKey = keyof typeof OG_PAGES;
