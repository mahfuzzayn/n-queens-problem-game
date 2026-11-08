/**
 * Rewarded Ad Configuration (Mutable / Configurable).
 * 
 * Defines parameters for rewarded ad hints:
 * - Brand details for "Shoetic"
 * - 10-second view verification requirement
 * - Match repetition limit (max 10 times per game)
 */

export interface AdConfig {
  id: string;
  brandName: string;
  tagline: string;
  headline: string;
  description: string;
  features: string[];
  ctaText: string;
  targetUrl: string;
  themeColor: string;
  accentColor: string;
  requiredViewTimeSeconds: number;
  maxRewardedHintsPerMatch: number;
}

export const SHOETIC_AD_CONFIG: AdConfig = {
  id: 'shoetic-premium',
  brandName: 'Shoetic',
  tagline: 'Artisanal Footwear & Cloud Comfort',
  headline: 'Walk on Clouds with Handcrafted Italian Leather',
  description:
    'Engineered with orthopedic arch-lift technology, breathable micro-mesh lining, and bespoke luxury styling. Designed for those who conquer the board and the world.',
  features: [
    '100% Full-Grain Italian Leather',
    'Custom Cloud-Foam Cushioning',
    'Orthopedic Anti-Fatigue Arch Support',
    'Free Global Express Shipping',
  ],
  ctaText: 'Explore Shoetic Collection',
  targetUrl: 'https://shoetic.com',
  themeColor: '#1a0b33',
  accentColor: '#f59e0b',
  requiredViewTimeSeconds: 10,
  maxRewardedHintsPerMatch: 10,
};
