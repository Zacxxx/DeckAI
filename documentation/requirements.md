# System Requirements

## High-Level Architecture
- **Agentic Core Engine**: Built upon a forked version of the **opencode harness** located securely in the isolated `/agent` directory. This handles multi-agent orchestration (Designer Agent, Validator Agent, Extractor Agent) and deterministic tool loops flawlessly.
- **Backend & API**: Organized inside the `/backend` directory functioning as the logical controller, connecting the frontend with the agent harness.
- **Database Layer**: Built on **Prisma + SQLite**, ensuring a flawlessly visual environment (via Prisma Studio) and 100% execution parity across local environments and cloud deployments.
- **Dual-Environment Deployment** (Managed in `/deploy`):
  1. **Cloud Inference Mode**: The harness is packaged as elastic microservices deployed to **Google Cloud Run**, allowing heavy headless-browser validation to scale instantly under load.
  2. **Local Harness Mode**: The user runs the forked opencode harness natively on their machine, utilizing **OpenRouter** for model inference to ensure strict privacy and model choice.

## Core Development Rules
All implementations strictly adhere to:
1. **DRY**: Logic must not repeat; unify prompts.
2. **API First**: Contract design precedes frontend/agent code.
3. **Issue Planning**: No ad-hoc development; plan via GitHub issues.
4. **Clear Data**: Avoid generic terms; structure semantic responses.
5. **Unified Schema**: Single source of truth via Prisma traversing frontend/backend/agent.
6. **Agent Usable**: APIs deliberately architected with flat structures and verbose errors so LLMs can auto-recover.

## Functional Requirements
1. **Generative Layout Engine (HTML/CSS/React)**:
   - The AI authors atomic React/HTML components bounded to strict viewports: A4 (`210mm x 297mm`) or 16:9 (`1920x1080`).
2. **Deterministic Layout Validation Skill**:
   - The AI is equipped with a headless browser (Puppeteer/Playwright) interaction skill, running either in the cloud or via a local validation server.
3. **Contextual Steering & Component Isolation**:
   - Users can lasso a group of DOM nodes natively on the React `/frontend`. The system extracts the localized HTML/CSS context and feeds it to the AI.
4. **Flawless Export Pipeline**:
   - PDF: Chromium print-to-pdf pipeline with perfect injection of `@page` CSS variables.
   - PPTX: Advanced DOM parser translating CSS properties into native OpenXML MS Office formats.

## Non-Functional Requirements
1. **Absolute Visual Perfection (10x Focus)**:
   - The system strictly forbids elements from bleeding out of the canvas. 
2. **Designer-Grade Aesthetics**:
   - Outputs must utilize 8pt/4pt grid systems automatically.
3. **High-Speed Agent Loops**:
   - Because the validation requires rendering, the architecture must parallelize validation tests where possible.
