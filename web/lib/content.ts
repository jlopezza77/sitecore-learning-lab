// Reads the same content files as the original site. This runs on the server at build time
// (like fetching content from Sitecore Experience Edge), never in the browser. More in lesson 6.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { MarketContent } from './types';

export function getContent(market: MarketContent['market']): MarketContent {
  const file = path.join(process.cwd(), '..', 'site', 'content', `${market}.json`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

// Prefixes /next to public files (images), because the app is served under that base path.
export const asset = (src: string) => `${process.env.NEXT_PUBLIC_BASE_PATH}/${src}`;
