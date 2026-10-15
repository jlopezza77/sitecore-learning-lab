// The simplest component: a function that returns JSX. It receives `brand` as a prop.
interface HeaderProps {
  brand: string;
}

export default function Header({ brand }: HeaderProps) {
  return (
    <header>
      <strong>{brand}</strong>
      <span className="note" style={{ color: '#fff' }}>Next.js version</span>
    </header>
  );
}
