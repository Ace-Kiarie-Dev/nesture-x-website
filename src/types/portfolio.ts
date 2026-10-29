// One entry in src/data/portfolio.json (the design portfolio).
export interface PortfolioItem {
  id: string;
  filename: string;
  client: string;
  type: string;
  /** Distinguishes items that share client + type (used in SEO titles). */
  variant?: string;
  isPDF: boolean;
  coverImage?: string;
  description: string;
  tags: string[];
  featured: boolean;
}
