# Release acceptance gates — HANDOFF v0.3

- [x] G1 — A public repository and a distinct feature branch exist. Evidence: GitHub branch `feat/continuity-core-v1`.
- [x] G2 — Core CLI, example, negative tests, CI workflow and usage documentation committed. Evidence: files in this branch.
- [x] G3 — Human continuity, decisions, obligations, authority, privacy, prior art and limitations documented. Evidence: `docs/`, `SECURITY.md`.
- [ ] G4 — CI on the **final** head commit succeeds. CHECK: GitHub Actions run for the exact SHA. EXPECT: conclusion success.
- [ ] G5 — Independent receiver cross-agent test passes with a source-grounded answer key. Manual gate: no independent recipient result yet.
- [ ] G6 — Real users prefer HANDOFF over alternatives in a measured usability study. Manual gate: not tested.
- [ ] G7 — Main branch contains an approved integrated release. CHECK: GitHub default branch contains verified files. EXPECT: files visible and CI green.

G5 and G6 are product-quality research gates, not preconditions for publishing an honestly labeled preview. No unmeasured superlative claims.
