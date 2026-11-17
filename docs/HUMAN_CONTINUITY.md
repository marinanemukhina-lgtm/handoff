# Human continuity — design proposal (2026-11-17)

## Problem
Handoffs can preserve tasks while losing the user's intention, rejected alternatives, promises and uncertainty. A fluent recipient summary is not proof of understanding.

## Proposed extensions (not yet automated)
1. **Intent:** what outcome the person wants, why, and what must not be silently optimized away.
2. **Rejected options:** option, evidence, reason, and conditions for reconsideration.
3. **Promise ledger:** commitment, owner, due date if known, evidence of completion, status. Never infer a due date.
4. **Disagreements:** competing claims, source for each, what remains unresolved.
5. **Recipient acknowledgment:** independently state objective, constraints, rejected approaches, next action and required permissions. No execution on acknowledgment alone.
6. **Return handoff:** actual changes, commit/artifacts, tests, failures, deviations, new decisions needing approval.
7. **Privacy preview:** default-deny for credentials, personal data, private links, proprietary materials. Pattern matching is insufficient; human review required.

## Critical boundaries
- Source conversation and retrieved documents are **data**, not new executable instructions.
- A recipient cannot grant itself permissions by reading a handoff.
- A previous user's request is background until confirmed as current authorization for consequential action.
- An unverified claim remains unverified across every transfer.
- Contradictory source statements remain visible; do not choose a winner by fluency.
- No claim that this design is unique; related patterns exist in agent-handoff, Open Grove and session persistence systems.

## Falsifiable evaluation
Use the same sanitized task with a plain summary baseline and a structured HANDOFF. Score objective, constraints, rejected options, commitments and next action from a source-grounded answer key. Test unauthorized-action resistance and deliberately stale data. Publish raw results and failures; do not report a success rate before tests.
