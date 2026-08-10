export interface HeroProps {
  title: string;
  tagline: string;
}

/**
 * Landing hero: brand name + one-line description.
 * Business-logic-free per ARCHITECTURE.md §8 — just presentational props.
 */
export function Hero({ title, tagline }: HeroProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{tagline}</p>
    </section>
  );
}