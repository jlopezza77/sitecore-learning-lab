import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import TrustSection from '@/components/TrustSection';
import { getContent } from '@/lib/content';

// Lesson 1: the page is a composition of components, each receiving its data through props.
// For now it shows Mexico only; routes per country come in lesson 5.
export default function HomePage() {
  const content = getContent('es-MX');

  return (
    <>
      <Header brand={content.brand} />
      <main>
        <Hero content={content.hero.default} />

        <section className="grid">
          {content.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              learnMoreLabel={content.labels.learnMore}
              applyLabel={content.labels.apply}
            />
          ))}
        </section>

        <TrustSection trust={content.trust} />
      </main>
    </>
  );
}
