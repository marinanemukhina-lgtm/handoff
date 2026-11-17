# Acceptance and limits

## Implemented
- JSON package v0.3 with required fields and decision/commitment records
- CLI structural validation, Markdown rendering
- Explicit CONTINUE default; REVIEW and OPEN_FIELD are optional, read-only output modes
- Node built-in test runner and GitHub Actions workflow

## Not implemented
- Automated extraction from chats or GitHub
- Independent source verification
- Personal-data detection or comprehensive secret scanning
- Authorization enforcement in other agents
- Cross-model transfer tests, user testing or benchmarks
- External integrations, background jobs, paid services

## Manual checks before sharing
1. Inspect full package for sensitive information and private URLs.
2. Check sources and latest repository state independently.
3. Confirm decision authority and budget/scope restrictions with owner.
4. Have recipient restate intent, approved decisions and next action.
5. Test an authorized bounded task and compare evidence with acceptance criteria.

A passing CLI check means only that required fields and a few obvious secret patterns passed. It does not certify correctness or safety.
