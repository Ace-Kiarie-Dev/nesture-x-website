---
name: Disciplined Precision
colors:
  surface: '#061423'
  surface-dim: '#061423'
  surface-bright: '#2d3a4b'
  surface-container-lowest: '#020f1e'
  surface-container-low: '#0f1c2c'
  surface-container: '#132030'
  surface-container-high: '#1e2b3b'
  surface-container-highest: '#293646'
  on-surface: '#d6e4f9'
  on-surface-variant: '#bbcac5'
  inverse-surface: '#d6e4f9'
  inverse-on-surface: '#243142'
  outline: '#85948f'
  outline-variant: '#3c4a46'
  surface-tint: '#40ddc2'
  primary: '#66fbdf'
  on-primary: '#00382f'
  primary-container: '#42dec3'
  on-primary-container: '#005e51'
  inverse-primary: '#006b5c'
  secondary: '#ffb955'
  on-secondary: '#452b00'
  secondary-container: '#a16900'
  on-secondary-container: '#fffbff'
  tertiary: '#ffdcda'
  on-tertiary: '#512222'
  tertiary-container: '#ffb5b2'
  on-tertiary-container: '#7b4442'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#65fade'
  primary-fixed-dim: '#40ddc2'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#005045'
  secondary-fixed: '#ffddb5'
  secondary-fixed-dim: '#ffb955'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#feb4b1'
  on-tertiary-fixed: '#360e0e'
  on-tertiary-fixed-variant: '#6c3836'
  background: '#061423'
  on-background: '#d6e4f9'
  surface-variant: '#293646'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.02em
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a calm, institutional-grade analytics interface tailored for disciplined sports bettors treating their activity as an alternative asset class. The tone rejects all predatory, dopamine-driven tropes of sportsbooks—no flashy neon gradients, no roulette iconography, no urgency-inducing animations, and strictly 0% casino vibe.

Instead, the aesthetic merges the razor-sharp utility of modern fintech (such as Revolut and Linear) with the architectural precision of high-end crypto dashboards (such as Uniswap). The layout leverages deep oceanic navy surfaces, ambient teal photon glows, structured geometric alignment markers, and translucent glass cards. The interface communicates rigorous ledger-level clarity, risk mitigation, and mathematical edge.

## Colors

The palette establishes an authoritative low-light environment engineered for extended data analysis and night-time match tracking:

- **Canvas & Surfaces**: The base canvas is `#061423` (Deep Navy). Intermediate panels and elevated cards step up to `#0B1E34` (Surface Navy), with nested utility containers resting on `rgba(11, 30, 52, 0.7)` frosted backdrop planes.
- **Teal Accent (`#42DEC3`)**: Serves as the primary operational accent—signaling capital gains, active ledger sync, verified win states, and high-impact calls to action. It also fuels soft atmospheric radial glows (10% to 20% opacity) pinned behind key metric clusters.
- **Gold Accent (`#FFB955`)**: Denotes staking badges, high-yield ROI highlights, tier indicators, and specialized analytics milestones.
- **Coral Accent (`#FFB5B2`)**: Communicates drawdown warnings, closed losing positions, and exposure limits without aggressive alert noise.
- **Typography & Structural Contrast**: Text primary is absolute `#FFFFFF`, secondary data points use soft grey-blue `#94A3B8`, and secondary borders or disabled stamps use subdued slate `#64748B`. Card borders use a calibrated sub-pixel stroke of `rgba(66, 222, 195, 0.25)`.

## Typography

Typography establishes an intentional contrast between technological authority and quantitative data integrity:

- **Headings (Space Grotesk)**: Imparts a geometric, forward-leaning architectural edge. Letterforms feature subtle mechanical joints that ground high-level copy in institutional rigor.
- **Body Text (Inter)**: Handles explanatory paragraphs, tooltips, and standard UI interactions with invisible, friction-free readability across both high-DPI displays and low-spec mobile panels.
- **Quantitative & Ledger Readouts (JetBrains Mono)**: Reserved for financial amounts (e.g., `KES 4,250.00`), betting yields, odds ratios, timestamps, and status metrics. Tabular figures ensure clean vertical alignment across tabular charts and ledger rows.

## Layout & Spacing

The layout is built on a disciplined 12-column desktop grid with a maximum content container width of 1280px, transitioning to an 8-column format on tablets (768px–1024px) and a unified 4-column flow below 768px.

Vertical rhythm adheres strictly to an 8px modular baseline (0.5rem increments). Spacing values are distributed cleanly: `space-xs` (4px) and `space-sm` (8px) govern micro-alignments, tag margins, and badge paddings; `space-md` (16px) establishes standard card interior padding; `space-lg` (24px) separates card groups and ledger columns; and `space-xl` (40px) commands section transitions and landing module gaps.

Grid columns are separated by micro-lines or 1.5rem gutters, accented by discrete corner dots (2x2px in `rgba(66, 222, 195, 0.4)`) at section boundaries to echo engineering blueprints.

## Elevation & Depth

Visual hierarchy rejects standard drop shadows in favor of ambient light diffusion, frosted transillumination, and fine hair-thin boundary lines:

- **Base Layer (L0)**: Canvas `#061423` featuring atmospheric radial gradients (`radial-gradient(circle at 50% 0%, rgba(66, 222, 195, 0.12) 0%, transparent 70%)`).
- **Surface Layer (L1)**: Frosted panels (`rgba(11, 30, 52, 0.7)`) backed by a 16px to 24px backdrop blur (`backdrop-filter: blur(20px)`). Panels are defined by a crisp 1px stroke of `rgba(66, 222, 195, 0.25)`.
- **Active Elevation (L2 - Hover/Focus)**: Transitions card borders to `rgba(66, 222, 195, 0.55)` and casts an ultra-wide, low-density teal halo (`box-shadow: 0 12px 40px -10px rgba(66, 222, 195, 0.15)`).
- **Overlays & Modals (L3)**: Solid `#0B1E34` paired with an inner top highlight border (`border-top: 1px solid rgba(255, 255, 255, 0.15)`) and external perimeter border in `rgba(66, 222, 195, 0.3)`.

## Shapes

The design uses balanced, modern curves (`roundedness: 2`, corresponding to 8px base border radius) to balance technical discipline with contemporary software ergonomics.

- **Base Radius (`0.5rem` / 8px)**: Standard inputs, data chips, segmented controls, table containers, and buttons.
- **Card Radius (`1rem` / 16px)**: High-level metric panels, floating ledger previews, and modal windows.
- **Macro Enclosures (`1.5rem` / 24px)**: Hero visual containers and interactive demo wrappers.
- **Pills**: Exclusively reserved for categorical indicator tags, badge highlights (e.g., ROI %, EV Status), and micro verification pills.

## Components

### Buttons
- **Primary Action**: Solid `#42DEC3` background, `#061423` bold text (`Space Grotesk`, 600 weight), 8px border radius, 12px vertical by 24px horizontal padding. Subtle hover state introduces an outer glow (`box-shadow: 0 0 20px rgba(66, 222, 195, 0.4)`).
- **Secondary Ghost**: Transparent background, 1px solid `rgba(66, 222, 195, 0.35)`, text `#FFFFFF`. Hover transitions background to `rgba(66, 222, 195, 0.08)` and border to `#42DEC3`.
- **Text / Inline**: Flat `#94A3B8` with an underlined hover in `#42DEC3`, accompanying JetBrains Mono arrow glyphs (`->`).

### Glass Cards & Data Tables
- **Metrics Card**: Built on `rgba(11, 30, 52, 0.7)` with `backdrop-filter: blur(16px)`, bound by 1px `rgba(66, 222, 195, 0.25)`. Houses tracking metrics, JetBrains Mono currency displays, and positive delta values in teal (`#42DEC3`) or negative delta values in coral (`#FFB5B2`).
- **Ledger Rows**: Alternate between transparent and `rgba(11, 30, 52, 0.4)` with 1px horizontal dividers (`rgba(100, 116, 139, 0.2)`). Numerical data strictly aligned to the right.

### Chips & Badges
- **Status Badges**: Capsule-shaped pill tokens. 
  - *Yield / Win*: Background `rgba(66, 222, 195, 0.1)`, text `#42DEC3`, border `1px solid rgba(66, 222, 195, 0.3)`.
  - *Risk / Drawdown*: Background `rgba(255, 181, 178, 0.1)`, text `#FFB5B2`, border `1px solid rgba(255, 181, 178, 0.3)`.
  - *Staking Tier / Premium*: Background `rgba(255, 185, 85, 0.1)`, text `#FFB955`, border `1px solid rgba(255, 185, 85, 0.3)`.

### Form Inputs & Fields
- Dark field surface `#071728`, 1px border `rgba(100, 116, 139, 0.4)`, font `Inter` 14px, placeholder `#64748B`.
- Focus state triggers border `#42DEC3` with a focused ring of `0 0 0 1px #42DEC3` without blur offset.
- Currency prepend (e.g., `KES`) fixed in `JetBrains Mono` at `#94A3B8`.

### Checkboxes & Segmented Controls
- Minimalist 16x16px boxes with 4px border radius. Unchecked state: 1px solid `#64748B`. Checked state: solid `#42DEC3` fill with a `#061423` inner check icon.
- Segmented time filters (`1D`, `1W`, `1M`, `YTD`, `ALL`): Dark surface background (`#071728`) with an active segment highlighted in `#0B1E34` and framed by a 1px `rgba(66, 222, 195, 0.4)` border.
