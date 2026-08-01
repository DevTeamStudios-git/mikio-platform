export default function HomePage() {
  return (
    <main>
      <h1>Mikio AI</h1>
      <p>
        A developer-first AI assistant for coding, debugging, and building
        software faster.
      </p>
      {/*
        Placeholder landing page — Phase 4 (First End-to-End Feature) wires
        this up to the actual chat flow: this client -> backend/api (NestJS)
        -> ai/inference (FastAPI) -> vLLM. See ARCHITECTURE.md §5 (Data Flow).
      */}
    </main>
  );
}
