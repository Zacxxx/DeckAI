# System Architecture & Technical Specifications

## 1. Directory Structure & Separation of Concerns
- `/frontend`: The Vite + React + TS workspace. Handles DOM selection, Canvas rendering, and UI states.
- `/backend`: The primary Node/Express REST API. Handles auth, database ORM, and generic logic.
- `/agent`: Fully isolated from `/backend`. Exclusively houses the complex LLM orchestration, opencode harness forks, prompts, and multi-turn loops.
- `/deploy`: Centralizes `Dockerfile.frontend`, `Dockerfile.backend`, and `docker-compose.yml` for unified local/cloud topology setups.

## 2. Shared Database Layer (Prisma + SQLite)
- **Local & Cloud Parity**: Uses SQLite to maintain an impossibly lightweight footprint (a single `dev.db` file) that executes identically in local development and scales gracefully natively or via volumes in Cloud Run.
- **Unified Schema & Visual Admin**: Driven entirely by Prisma Schema (`schema.prisma`), functioning as the absolute single source of truth across `/frontend`, `/backend`, and `/agent`. Allows immediate insight via `npx prisma studio`.

## 3. Multi-Agent Orchestration (Opencode Harness)
- **Dual-Mode Inference Topologies**:
  - **Cloud Inference Mode**: Runs on Google Cloud Run utilizing massive compute.
  - **Local Harness Mode**: Executed via OpenRouter on localhost, bypassing cloud servers completely for absolute data privacy.
- **Specialized Sub-Agents**:
  - **The Orchestrator**: Manages state, routes prompts, and breaks down the task.
  - **The Designer Agent**: Authors semantic HTML/CSS layouts based on strict contextual design tokens.
  - **The Validator Agent**: Executes tools to mathematically validate bounding boxes.

## 4. The Verification Environment (Headless Browser APIs)
- **Validation Fleet (Cloud)**: Elastically scalable instances of Playwright.
- **Validation Local Node (Local)**: A lightweight local Playwright server.
- **Superposition Math**: Calculates bounding box intersections. 
- **Text Overflow Engine**: Checks for `scrollHeight > clientHeight`.

## 5. Development Governance
Code written across any environment strictly adheres to the 6 system paradigms: **DRY**, **API First**, **Issue Planning**, **Clear Data**, **Unified Schema**, and **Agent Usable** APIs. Every API endpoint must be verbose enough to allow the `agent` to self-heal upon failure.
