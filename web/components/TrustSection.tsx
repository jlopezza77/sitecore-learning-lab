import type { TrustContent } from '@/lib/types';
import { asset } from '@/lib/content';

interface TrustSectionProps {
  trust: TrustContent;
}

export default function TrustSection({ trust }: TrustSectionProps) {
  return (
    <section className="trust">
      <img src={asset(trust.image)} alt={trust.alt} />
      <div className="trust-body">
        <h2>{trust.title}</h2>
        <p>{trust.text}</p>
        <ul className="badges">
          {/* Lists: .map() turns data into elements. Each item needs a unique `key`. */}
          {trust.badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
        <p className="note">{trust.note}</p>
      </div>
    </section>
  );
}
