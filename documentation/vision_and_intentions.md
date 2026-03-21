# Vision and Intentions

## Vision: The 10x Paradigm Shift in Desktop Publishing
We are tearing down the archaic barriers of manual document formatting. Our vision is to empower anyone to build breathtaking, pixel-perfect presentations and documents at the speed of thought. By orchestrating advanced AI agents mathematically constrained to flawless layouts, we guarantee a 1:1 translation of human intent into stunning, unbounded creativity—without ever dragging a text box again.

## Intentions & The "Wow Factor"
1. **Absolute Layout Guarantees (Zero Broken Elements)**
   - *Intention*: The days of fighting with overlapping text, weirdly scaled images, or elements jumping out of bounds are over.
   - *10x Execution*: The AI doesn't just "guess" HTML; it validates designs in real-time against a deterministic rendering engine. 
2. **Frictionless Steering & Agentic Translation**
   - *Intention*: Users should speak naturally, and the system acts as an expert designer.
3. **Flexible Inference & Local Sovereignty**
   - *Intention*: Users can run the system entirely locally or fully cloud-hosted.
   - *10x Execution*: By utilizing a forked **opencode harness**, the agent execution layer is completely decoupled in its own `/agent` workspace. Users can run the harness locally connecting to OpenRouter for zero vendor lock-in.
4. **Platform-Agnostic Flawlessness**
   - *Intention*: HTML is the canvas, but native files are the currency.

## Product Engineering Manifest
To achieve this vision, the codebase is structurally bound by 6 absolute paradigms ensuring the codebase stays rigorous and the Agent can heal itself:
1. **DRY** logic across all environments.
2. **API First** API-driven contracts.
3. **Issue Planning** (no ad-hoc engineering).
4. **Clear Data** semantics.
5. **Unified Schema** powered by a single visually administrable **SQLite + Prisma** file spanning the `/frontend`, `/backend`, and `/agent` workspaces.
6. **Agent Usable** endpoints, returning verbose, descriptive error metadata so the LLM remains fully autonomous and self-healing.
