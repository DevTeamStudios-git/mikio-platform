import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";

import { Hero } from "../components";

describe("Hero", () => {
  it("renders the title and tagline", () => {
    const html = renderToString(<Hero title="Mikio AI" tagline="A developer-first AI assistant." />);
    expect(html).toContain("<h1>Mikio AI</h1>");
    expect(html).toContain("A developer-first AI assistant.");
  });
});