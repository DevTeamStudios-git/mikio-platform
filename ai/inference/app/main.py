from fastapi import FastAPI

# Smallest useful slice: the service boots and reports status.
# No model loading, no vLLM connection, no tool layer yet — those land
# once there's an actual STR checkpoint to serve (ai/models/ is still
# empty). See ARCHITECTURE.md §6 for the training->evaluation->release
# pipeline this waits on.
#
# Boundary reminder: backend/ (NestJS) reaches this service over HTTP.
# This app never imports anything from backend/ directly, and vice versa.

app = FastAPI(
    title="Mikio AI — Inference Service",
    description="Serves the STR model family. Currently a placeholder — no model is loaded yet.",
    version="0.1.0",
)


@app.get("/")
def get_status() -> dict[str, str]:
    return {"status": "ok", "service": "mikio-ai-inference"}
