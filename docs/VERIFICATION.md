# Verification levels

- **L0:** Required sections present.
- **L1:** Required fields nonempty; obvious credential patterns absent. Implemented by `bin/validate.mjs`.
- **L2:** Independently verify links, repository SHA, versions and permissions. Not automated.
- **L3:** Independent receiver reconstructs goals, decisions and next action against a source-based answer key. Not implemented.
- **L4:** Receiver completes a bounded authorized task and passes acceptance tests. Not implemented.

L1 is **not** evidence of L2–L4. Regex-based scanning cannot prove a package contains no secrets or personal data.

Run: `node bin/validate.mjs examples/EXAMPLE_HANDOFF.md`.
Exit 0: L1 passed; 1: findings; 2: usage/read error.
