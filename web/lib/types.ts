// TypeScript types describe the shape of our content files (site/content/<market>.json).
// If a component uses a field that doesn't exist, the build fails instead of the page breaking.

export type ProductId = 'card' | 'loan' | 'savings';

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  details: {
    intro: string;
    items: { name: string; features: string[] }[];
  };
}

export interface TrustContent {
  image: string;
  alt: string;
  title: string;
  text: string;
  badges: string[];
  note: string;
}

export interface MarketContent {
  market: 'es-MX' | 'es-CO' | 'pt-BR';
  country: string;
  brand: string;
  hero: { default: HeroContent };
  offers: Record<ProductId, HeroContent>;
  products: Product[];
  trust: TrustContent;
  labels: Record<string, string>;
}
