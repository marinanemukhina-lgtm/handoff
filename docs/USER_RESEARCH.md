# User research notes — 2026-11-17

These are **anecdotal public reports**, not prevalence measurements or controlled user studies.

| Observed complaint | Public discussion | Design implication |
| --- | --- | --- |
| Rejected options and rationale disappear after compaction | https://www.reddit.com/r/ClaudeAI/comments/1vwy3hw/compaction_keeps_what_we_built_and_forgets_what/ | Preserve rejected alternatives and why |
| Agent ignores explicit handoff and claims unfinished work completed | https://www.reddit.com/r/ClaudeAI/comments/1vr6kwb/claude_keeps_ignoring_documented_work_how_do_you/ | Receiver acknowledgment plus evidence-based completion |
| Writing handoff manually is tedious | https://www.reddit.com/r/ClaudeCode/comments/1xl2kw9/hand_off_the_session_habit_that_made_my_claude/ | Design for one-click generation later |
| Compaction timing is unreliable | https://www.reddit.com/r/ClaudeAI/comments/1wui0hj/can_you_force_claude_to_write_a_handoff_md_file/ | Event-based checkpoints, not last-minute extraction |
| Context gets stale across long threads | https://www.reddit.com/r/ClaudeAI/comments/1xko2ir/how_do_you_decide_when_to_start_a_fresh_claude/ | Source timestamps, stale-data warnings |

## Other existing work
- https://github.com/open-grove/handoff — explicit share vs continue intent.
- https://github.com/drdeeks/agent-handoff — scan, preserve, validate, seal, reconstruct, verify.
- https://github.com/microsoft/agent-framework — orchestration handoff and checkpointing.
- https://github.com/wjgoarxiv/agent-handoff-skill — continuation document skill.

## What is still unknown
No evidence yet that the proposed human-continuity sections improve real task completion. Test with a control group and sanitized tasks before claiming superiority.
