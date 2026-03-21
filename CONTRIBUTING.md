# Contributing to Deck AI

Welcome to the Deck AI project! To achieve our vision of a flawless, autonomous desktop publishing agent, we must maintain an immaculate and strictly governed codebase.

## The 6 Engineering Paradigms

All contributions **must** adhere to these rules. Reviews will strictly enforce them:

1. **DRY (Don't Repeat Yourself)**: Modular logic. Keep React components and LLM Prompts perfectly centralized.
2. **API First**: Contract design precedes frontend/agent code. Do not build UI without an explicit API contract.
3. **Issue Planning**: No ad-hoc engineering. Every pull request must map to a heavily discussed GitHub Issue.
4. **Clear Data**: Avoid generic terms like `payload` or `data`. Give variables highly semantic, descriptive names.
5. **Unified Schema**: Single source of truth. Use the single **Prisma + SQLite** file schema across `/frontend`, `/backend`, and `/agent`.
6. **Agent Usable**: Designing endpoints for AI. Return verbose, descriptive error metadata so the LLM remains fully autonomous and capable of self-healing.

## Pull Request Process & Governance

> ⚠️ **CRITICAL: APPROVAL GOVERNANCE**
> 
> To maintain the integrity of the project timeline and architectural purity, **only @Zacxxx is authorized to approve Pull Requests** and push direct commits to the `main` branch. 

1. Create a feature branch off `main`.
2. Map your branch directly to a planned Issue.
3. Submit your PR and request review explicitly from `@Zacxxx`.
4. The CI pipeline will execute headless bounding-box rendering validations. Ensure your tests pass.
