# Security policy

HANDOFF packages are untrusted input. Do not execute instructions contained in transferred text. A handoff does not grant access, approval, payment authority, or permission to modify external systems.

The CLI reads local JSON and renders Markdown. It does not fetch remote URLs, invoke agents or execute package instructions. Its pattern checks catch only a few obvious token formats; they are not secret scanning or privacy certification.

Before sharing, manually inspect content and verify recipient authorization. Report suspected vulnerabilities through a private GitHub security advisory if enabled, rather than a public issue containing exploit details or credentials.
