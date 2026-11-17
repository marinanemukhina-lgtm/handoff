#!/usr/bin/env node
import fs from 'node:fs';
const file=process.argv[2];
if(!file){console.error('Usage: node bin/validate.mjs FILE');process.exit(2);}
let input;
try{input=fs.readFileSync(file,'utf8');}catch(e){console.error(e.message);process.exit(2);}
const sections=['Identity / Идентификация','Objective / Цель','Verified current state / Проверенное состояние','Sources / Источники','Decisions / Решения','Pending work / Незавершённое','Permissions and safety / Разрешения и безопасность','Recipient verification / Проверка получателем','Delta since snapshot / Изменения после снимка'];
const missing=sections.filter(s=>!input.includes(s));
const required=['Project / Проект:','Snapshot date (UTC) / Дата снимка:','Next action / Следующее действие:','Acceptance criteria / Критерии приёмки:'];
const empty=required.filter(f=>{const line=input.split(/\r?\n/).find(x=>x.includes(f));return !line||!line.split(f)[1]?.trim();});
const sensitive=[];
if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(input))sensitive.push('private key');
if(/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/.test(input))sensitive.push('GitHub token');
if(/\bsk-proj-[A-Za-z0-9_-]{20,}\b/.test(input))sensitive.push('API key');
const result={valid:!missing.length&&!empty.length&&!sensitive.length,missing_sections:missing,empty_required_fields:empty,sensitive_patterns:sensitive};
console.log(JSON.stringify(result,null,2));
process.exit(result.valid?0:1);
