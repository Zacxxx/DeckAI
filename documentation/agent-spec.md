# Agent Harness Specification

## Overview
The Deck AI agent harness is a highly performant, deterministic execution environment built entirely in **Rust**. It is a customized fork of the `opencode` harness, explicitly stripped of all GUI components to function purely as an API-driven orchestration and routing layer.

## Core Responsibilities
1. **Model Routing (OpenRouter Integration)**: 
   - Natively connects to OpenRouter to abstract LLM API calls.
   - Handles retries, rate-limiting, and context-window chunking at a high-performance system level.
2. **Deterministic Tool Execution**:
   - Spawns headless browser binaries (e.g., via Rust Playwright bindings or raw DevTools Protocol) to evaluate DOM boundaries rapidly.
   - Returns absolute JSON data structures to the LLM context.
3. **State & Memory Management**:
   - Manages the multi-pass layout loops (Designer -> Validator -> Extractor) in rapid succession.
   - Compiles user prompts, design tokens (from SQLite/Vector DB), and selected `<divs>` into strict system axioms.

## Architecture (Rust)
- **Language**: Rust 🦀
- **Concurrency**: `tokio` for async routing and headless browser pooling.
- **Serialization**: `serde` and `serde_json` for strict type-casting of LLM tool-calling inputs/outputs.
- **API Boundary**: Serves a local/cloud gRPC or high-performance REST boundary to the Node.js `/backend`.

## Flow
1. User interacts with Canvas (`/frontend`).
2. Node API (`/backend`) formats the request and calls the Rust Harness (`/agent`).
3. Rust Harness builds the strict system prompt, hits OpenRouter, receives raw HTML/CSS structural updates.
4. Rust Harness spawns validation subprocesses to mathematically prove the layout works.
5. If valid, Rust Harness streams the patch back down to Node -> Frontend.
