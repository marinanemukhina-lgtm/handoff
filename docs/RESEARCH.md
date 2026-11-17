# HANDOFF competitive research — 2026-11-17

Scope: public repository documentation and user discussions. Not a comprehensive market survey, independent UX benchmark or security audit.

| Existing solution | Documented capability | HANDOFF decision |
| --- | --- | --- |
| [Cross-Agent Handoff](https://github.com/kristianrolando/cross-agent-handoff) | Shared checkpoint, multi-agent skill routes, resume and validation | ADAPT format ideas, not code |
| [agent-handoff](https://github.com/leantli/agent-handoff) | Global/project/checkpoint memory layers | REFERENCE separation of concerns |
| [agent-checkpoint](https://github.com/hotalexnet/agent-checkpoint) | Repo-local timestamped checkpoint and git evidence | REFERENCE evidence and resume |
| [aynaash/handoff](https://github.com/aynaash/handoff) | Agent adapters and local UI | WATCH optional adapters |
| [drdeeks/agent-handoff](https://github.com/drdeeks/agent-handoff) | Adaptive preservation before compaction | WATCH automated checkpoints |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Durable execution, checkpoint and human interrupts | ADAPT later via optional integration |
| [Graphiti](https://github.com/getzep/graphiti) | Time-aware knowledge graph | WATCH; avoid core dependency |
| [Mem0](https://github.com/mem0ai/mem0) | Agent memory | WATCH optional integration |
| [Letta](https://github.com/letta-ai/letta) | Stateful agent memory | WATCH optional integration |

User reports:
- [Compaction loses corrected mistakes](https://www.reddit.com/r/ClaudeCode/comments/1x7pa1q/anyone_feel_issues_after_compact/)
- [Older decisions and working style lost](https://www.reddit.com/r/ClaudeCode/comments/1xbfly6/60_compactions_into_one_claude_code_session_the/)
- [Nontechnical users cannot rely on pre-compaction timing](https://www.reddit.com/r/ClaudeAI/comments/1wui0hj/can_you_force_claude_to_write_a_handoff_md_file/)
- [Markdown maintenance becomes stale and cumbersome](https://www.reddit.com/r/ClaudeCoding/comments/1wf5srx/tldr_anyone_else_tired_of_maintaining_handoff/)

These are anecdotes and must not be treated as measured market prevalence.

## What we build now
A zero-dependency, human-readable continuity package: approved decisions, commitments, source pointers, permissions, explicit next action, optional read-only REVIEW and OPEN_FIELD. No upstream code copied.

## What we do not claim
- No automatic chat extraction or integration with every provider
- No guarantee of truth from a valid package
- No guarantee that credentials or personal data are absent
- No ability to enforce permissions in third-party agents
- No proven superiority over alternatives

## License boundary
Links and design comparisons are not license clearance for copying code. Check upstream license and attribution before any reuse.
