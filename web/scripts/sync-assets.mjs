// The original site (../site) stays the single source of images.
// Before dev/build we copy them into public/, which Next.js serves as-is.
import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('public', { recursive: true });
cpSync('../site/images', 'public/images', { recursive: true });
console.log('Synced ../site/images -> public/images');
