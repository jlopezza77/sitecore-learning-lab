import type { HeroContent } from '@/lib/types';

// Props can be optional (`personalized?`). The component decides how it looks from its props:
// same component, different data → different result. That's the core idea of React.
interface HeroProps {
  content: HeroContent;
  personalized?: boolean;
}

export default function Hero({ content, personalized = false }: HeroProps) {
  return (
    // JSX uses `className` instead of `class`, and `{}` to insert JavaScript values.
    <section className={personalized ? 'hero personalized' : 'hero'}>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
      <button className="btn">{content.cta}</button>
    </section>
  );
}
