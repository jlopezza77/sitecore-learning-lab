import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  learnMoreLabel: string;
  applyLabel: string;
}

// One reusable card. The page renders it three times with different `product` props.
export default function ProductCard({ product, learnMoreLabel, applyLabel }: ProductCardProps) {
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="actions">
        {/* Buttons do nothing yet: events and state come in lesson 2. */}
        <button className="btn primary">{learnMoreLabel}</button>
        <button className="btn">{applyLabel}</button>
      </div>
    </article>
  );
}
