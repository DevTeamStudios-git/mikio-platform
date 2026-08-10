import { Hero } from "@mikio-ai/frontend";

export default function HomePage() {
  return (
    <main>
      <Hero title="Mikio AI" tagline="A developer-first AI assistant for coding, debugging, and building software faster." />
      {/*
        Placeholder landing page — Phase 4 (First End-to-End Feature) wires
        this up to the actual chat flow: this client -> backend/api (NestJS)
        -> ai/inference (FastAPI) -> vLLM. See ARCHITECTURE.md §5 (Data Flow).
      */}
    </main>
  );
}
