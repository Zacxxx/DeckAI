# Tasklist / GitHub Issues

### Epic 1: Custom Agent Orchestration (Opencode Harness)
- [ ] **Issue #0:** Fork and customize the `opencode harness` as the core agent execution and tool-calling layer.
- [ ] **Issue #1:** Implement Dual-Environment support: configure the harness to route to **Google Cloud Run** for managed inference, or run a **Local Harness** node pointing to **OpenRouter**.
- [ ] **Issue #2:** Build the Design System RAG context window (injecting user specific tokens, fonts, and grid logic as strict axioms into the Agent's prompt).
- [ ] **Issue #3:** Implement State Management to handle multi-turn iterative layout loops transparently within the opencode harness (Agent retries before showing output).

### Epic 2: The Deterministic Headless Validator (Zero Layout Breaks)
- [ ] **Issue #4:** Deploy Playwright on Google Cloud Run as a validation API for cloud users, and package a local Playwright runtime for the Local Harness.
- [ ] **Issue #5:** Create the "Boundary Checker" tool for the harness: parse DOM, return bounding rects, and mathematically flag overlaps/overflows.
- [ ] **Issue #6:** Create the "Aesthetics Checker" tool: validate WCAG contrast ratios and micro-alignment using basic design heuristics (8pt grid snap checks).

### Epic 3: Frontend Steering & Canvas Interactions
- [ ] **Issue #7:** Build React Canvas with strict A4 and 16:9 viewport `iframes` scaling precisely to screen size without distortion.
- [ ] **Issue #8:** Implement DOM selection bounding box logic to let users isolate nested semantic HTML components frictionlessly. 
- [ ] **Issue #9:** Create the granular "Steering Protocol" (transmit selected DOM subset + localized user prompt -> receive targeted HTML patch from the harness).

### Epic 4: The 10x Component Extraction System
- [ ] **Issue #10:** Implement intelligent DOM-to-Component parser (user clicks "Save Component", system strips hardcoded text and parameterizes the structure).
- [ ] **Issue #11:** Build UI/DB for managing saved Components/Design Systems (supporting both cloud vector DBs and local SQLite/Chroma instance for Local Mode).

### Epic 5: Flawless Native Exporters
- [ ] **Issue #12:** Build the High-Fidelity Chromium PDF printer service (`@page` boundaries matched perfectly to HTML scale).
- [ ] **Issue #13:** Develop HTML-to-OpenXML parser. Map CSS layouts (flexbox/grid approximations via absolute coordinates) to PPTX native objects automatically.
- [ ] **Issue #14:** Ensure interactive charts in HTML are rebuilt natively via OpenXML chart injection in PPTX exports.
