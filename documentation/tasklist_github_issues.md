# Tasklist / GitHub Issues

## Project: Agent (Mob)

### Epic 1: Custom Agent Orchestration (Codex Harness)
- [x] **Issue #0:** Extract and customize the `openai/codex` harness as the core agent orchestration (Rust/Tokio layer).
- [x] **Issue #1:** Implement Dual-Environment routing supporting **Google Cloud Run** and the **Local Harness** node via MCP server logic.
- [x] **Issue #3:** Build the TUI Dashboard for state visibility and real-time validation monitoring. **(Status: Completed natively via Ratatui)**

### Epic 2: The Deterministic Headless Validator (Zero Layout Breaks)
- [x] **Issue #4:** Deploy Playwright on Cloud Run as an active physics node.
- [x] **Issue #5:** Build the `validate_layout` "Boundary Checker" tool mathematically parsing DOM boundaries against viewport rects.
- [x] **Issue #6:** Build the `verify_aesthetics` tool mapping WCAG contrast and strict 8pt grid snapping.

***

## Project: Backend (Node.js API)

### Epic 5: Flawless Native Exporters Core
- [x] **Issue #12:** Build the High-Fidelity Chromium PDF printer service (`@page` boundaries matched perfectly to HTML scale via Playwright).
- [x] **Issue #13:** Develop HTML-to-OpenXML parser structure mapped to PPTX natively (`pptxgenjs`).
- [x] **Issue #14:** Implement the strict OpenXML chart injection parsing dynamically from HTML chart boundaries.

### Epic 6: Agnostic State Management
- [x] **Issue #2 (Moved):** Design the Unified Schema (Prisma/SQLite) securely storing `Project`, `Slide`, and `DesignSystem` models.
- [x] **Issue #15 (New):** Build the Model Context Protocol (MCP) Server endpoints (`/api/mcp/tools`, `/api/mcp/execute`) to decouple UX from Agent.
- [x] **Issue #11:** Build UI/DB endpoints for retrieving and mutating saved Components natively.

***

## Project: Frontend (React Canvas)

### Epic 3: Frontend Steering & Canvas Interactions
- [x] **Issue #7:** Build React Canvas integrating strict A4 and 16:9 viewport `iframes` scaling precisely to screen size.
- [x] **Issue #8:** Implement DOM selection bounding box logic to isolate nested semantic HTML components dynamically.
- [x] **Issue #9:** Wire the localized Steering Protocol capturing the mutated DOM subsets and pushing them via the MCP endpoints.

### Epic 4: The 10x Component Extraction System
- [x] **Issue #10:** Implement intelligent DOM-to-Component parser abstracting localized classes into parameterized generic UI tokens.
