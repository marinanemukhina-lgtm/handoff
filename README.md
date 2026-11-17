# HANDOFF

**Continue the work, not the conversation.**

HANDOFF is an open, portable format for transferring project context between people, AI assistants and work environments.

**Русский:** HANDOFF — открытый формат передачи состояния проекта. Он помогает новому исполнителю понять, что уже сделано, какие решения приняты, на чём они основаны и что делать дальше.

## No-install browser builder / Конструктор без установки

Open **[HANDOFF browser builder](https://marinanemukhina-lgtm.github.io/handoff/)** once GitHub Pages is enabled (Settings → Pages → Deploy from branch → main → /docs). Until then, open `docs/index.html` locally in a browser. Enter the project details and download JSON or Markdown. Everything runs locally in the browser; there is no server upload. This interface does not automatically import conversations, validate facts or enforce permissions.

Откройте `docs/index.html` в браузере, заполните поля и скачайте файл передачи. Никакой регистрации, платной подписки или сервера не требуется. Для публичной ссылки необходимо отдельно включить GitHub Pages.

## Quick start / Быстрый старт

1. Copy [the template](templates/HANDOFF.md) into your project.
2. Fill in verified facts and source links. Mark assumptions explicitly.
3. Remove secrets, credentials, private information and sensitive internal links.
4. Give the completed document to the next person or assistant.
5. The recipient independently checks sources and updates the status before continuing.

Скопируйте шаблон, заполните подтверждёнными данными, удалите секреты и персональную информацию, передайте новому исполнителю. Получатель проверяет актуальность источников перед работой.

## What HANDOFF is / Что это такое

A structured transfer document, **not** an automatic export of all conversations, an AI memory service, or a guarantee that every model can access linked files.

Структурированный документ передачи, **не** автоматический экспорт переписок и не обещание доступа ИИ ко всем указанным источникам.

## Principles / Принципы

- Evidence over recollection / Проверенные источники важнее воспоминаний
- Decisions and unresolved questions stay distinct / Решения отделены от открытых вопросов
- Snapshot date and version are explicit / Указаны дата и версия снимка
- No secrets in transfer packages / Никаких секретов в пакетах
- The receiving party verifies before acting / Получатель проверяет данные перед действиями
- External changes require authorization / Внешние изменения требуют разрешения

## Status

**v0.3 — public preview.** CLI structural tests are automated. No independent cross-model or usability benchmark has been completed; not production-certified.

## Background

Developed from the HANDOFF documentation workflow used in NEMUKHINA SYSTEM. This public repository contains an independent, sanitized template and does not expose internal transfer archives.

## License

Documentation and templates: [MIT](LICENSE). 

## Continuity core (preview v0.3)

The zero-dependency CLI and automated tests are included in this repository. The default behavior is CONTINUE; optional REVIEW and OPEN_FIELD produce analysis only and do not modify approved plans.

```bash
node bin/handoff.mjs validate examples/sample.json
node bin/handoff.mjs render examples/sample.json
node bin/handoff.mjs review examples/sample.json
node bin/handoff.mjs open-field examples/sample.json
node --test tests/*.test.mjs
```

Read [research](docs/RESEARCH.md) and [acceptance limitations](docs/ACCEPTANCE.md). The tool does not enforce third-party permissions or verify source truth.
