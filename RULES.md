# Development Rules

## 1. DRY (Don't Repeat Yourself)
- Keep business logic modular and reusable.
- Extract common layout patterns in the frontend into reusable React components.
- Agent instructions and prompts should be centralized to avoid scattering LLM tuning logic.

## 2. API First
- Design and document the API contracts (endpoints, payloads, responses) before writing the UI or Agent logic.
- The frontend and the agent harness must consume the same strict APIs consistently.

## 3. Issue Planning
- No ad-hoc development.
- Every feature, refactor, or bug fix must be thoroughly scoped and planned out as an Issue first.
- Discuss architectural changes in issues before diving into implementation.

## 4. Clear Data
- Avoid generic `data` or `payload` objects. 
- Give variables semantic, descriptive names conveying their exact purpose.
- Data structures should be immediately readable and self-documenting.

## 5. Unified Schema
- Share TypeScript interfaces strictly across the frontend, logical backend, and agent harness workspaces.
- Ensure the database schema acts as the single, strongly-typed source of truth.

## 6. Agent Usable
- APIs, schemas, and data structures must be explicitly designed so that LLM agents can easily reason about and interface with them.
- Avoid hyper-complex nested structures where a flat, descriptive API works much better for an LLM context window.
- Tools exposed to the agent must return highly verbose error messages to enable deterministic agentic auto-recovery.
