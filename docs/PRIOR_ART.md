# Prior art — research snapshot 2026-11-17

This is a comparison of documented features, not a comprehensive benchmark.

| Project | Relevant feature | Decision |
| --- | --- | --- |
| [CatchUp](https://github.com/wilbeibi/catchup) | Local session extraction, cross-agent resume | ADAPT later, don't rebuild parsers |
| [Cross-Agent Handoff](https://github.com/kristianrolando/cross-agent-handoff) | Shared checkpoint across agents | REFERENCE interoperability |
| [agent-handoff](https://github.com/jensvanbellen/agent-handoff) | Claude/Codex handoff skill | REFERENCE simple UX |
| [open-grove/handoff](https://github.com/open-grove/handoff) | Immutable model-independent snapshot | REFERENCE read-only source |
| [AGENTS.md](https://agents.md/) | Repo-scoped agent instructions | COMPLEMENT, not work state |
| [Mem0](https://github.com/mem0ai/mem0) | Long-term agent memory | COMPLEMENT |
| [Graphiti](https://github.com/getzep/graphiti) | Temporal knowledge graph | WATCH |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Session capture and recall | WATCH privacy |
| [Letta](https://github.com/letta-ai/letta) | Stateful agents | COMPLEMENT |
| [OpenHands](https://github.com/All-Hands-AI/OpenHands) | Agent workflows and events | REFERENCE provenance |

HANDOFF focuses on portable **verification of a handoff**, not a claim of unique cross-agent transfer. No upstream code was copied. Review upstream licenses before reuse.

## Evaluation still required
Transfer the same sanitized project to independent receiving agents, compare reconstruction of goals, decisions, constraints, sources and next action against an answer key. Compare against a plain summary baseline.
