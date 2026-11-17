# Contributing

Open an issue with a reproducible use case, expected behavior and sanitized example. Do not include secrets, personal data, private source URLs or proprietary material.

For code changes:

```sh
node --test tests/*.test.mjs
node bin/handoff.mjs validate examples/sample.json
```

Pull requests should include a negative test when changing validation or permissions, describe compatibility effects and disclose external code reuse and its license. Review does not grant deployment or publication rights.
