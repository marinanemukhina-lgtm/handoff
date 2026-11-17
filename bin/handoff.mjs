#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = ['version','project','snapshot','intent','state','decisions','commitments','permissions','next'];
const has = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
function validate(o) {
  const errors = [];
  if (!o || typeof o !== 'object' || Array.isArray(o)) return ['Package must be a JSON object'];
  for (const k of required) if (!has(o,k)) errors.push('Missing '+k);
  if (o.version !== '0.3') errors.push('Unsupported version (expected 0.3)');
  if (!o.project || typeof o.project !== 'string') errors.push('Project must be nonempty text');
  if (!o.snapshot || !/^\d{4}-\d\d-\d\d$/.test(o.snapshot)) errors.push('Snapshot must be YYYY-MM-DD');
  for (const k of ['decisions','commitments']) if (!Array.isArray(o[k])) errors.push(k+' must be an array');
  if (!o.permissions || !Array.isArray(o.permissions.allowed) || !Array.isArray(o.permissions.requires_approval)) errors.push('Permissions need allowed and requires_approval arrays');
  if (!o.next || !o.next.action || !o.next.acceptance) errors.push('Next action and acceptance required');
  if (typeof o.intent !== 'string' || !o.intent.trim()) errors.push('Intent required');
  if (typeof o.state !== 'string' || !o.state.trim()) errors.push('State required');
  for (const [i,d] of (Array.isArray(o.decisions)?o.decisions:[]).entries()) {
    if (!d.id || !d.status || !d.statement || !d.source) errors.push('Decision '+i+' needs id, status, statement, source');
    if (!['approved','proposed','rejected','superseded'].includes(d.status)) errors.push('Decision '+i+' has invalid status');
  }
  for (const [i,c] of (Array.isArray(o.commitments)?o.commitments:[]).entries()) {
    if (!c.id || !c.owner || !c.status) errors.push('Commitment '+i+' needs id, owner, status');
  }
  const raw=JSON.stringify(o);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(raw) || /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/.test(raw) || /\bsk-proj-[A-Za-z0-9_-]{20,}\b/.test(raw)) errors.push('Possible credential detected');
  return errors;
}
function report(o) {
  const approved=(o.decisions||[]).filter(x=>x.status==='approved');
  return [
    '# HANDOFF — '+o.project,
    'Snapshot: '+o.snapshot,
    '## Intent\n'+o.intent,
    '## Verified state / stated state\n'+o.state,
    '## Approved decisions\n'+(approved.map(x=>'- '+x.id+': '+x.statement+' (source: '+x.source+')').join('\n')||'None recorded'),
    '## Commitments\n'+((o.commitments||[]).map(x=>'- '+x.id+': '+x.status+'; owner: '+x.owner+(x.due?' due: '+x.due:'')).join('\n')||'None recorded'),
    '## Permissions\nAllowed: '+o.permissions.allowed.join(', ')+'\nApproval required: '+o.permissions.requires_approval.join(', '),
    '## Next action\n'+o.next.action+'\nAcceptance: '+o.next.acceptance,
    '## Receiver checklist\n- [ ] Verify sources and snapshot freshness\n- [ ] Restate approved decisions and obligations\n- [ ] Confirm permissions before consequential actions\n- [ ] Return evidence and unresolved items',
    '## Mode\nCONTINUE by default. REVIEW and OPEN_FIELD are opt-in, read-only analysis. No mode grants execution authority.'
  ].join('\n\n')+'\n';
}
const [command,filename,...extra]=process.argv.slice(2);
if (!command || !filename || !['validate','render','review','open-field'].includes(command)) {
  console.error('Usage: node bin/handoff.mjs validate|render|review|open-field package.json [output.md]');process.exit(2);
}
let data;
try { data=JSON.parse(readFileSync(resolve(filename),'utf8')); } catch(e) { console.error('Cannot read JSON: '+e.message);process.exit(2); }
const errors=validate(data);
if (errors.length) { console.error(errors.join('\n'));process.exit(1); }
if (command==='validate') { console.log('VALID: structural checks passed; source truth, privacy and authority NOT verified');process.exit(0); }
let output=report(data);
if (command==='review') output += '\n## Optional review — no execution\nConsider future transition costs, deadlines, penalties, dependencies and expected benefits. Historical sunk costs are not by themselves a reason to continue. Request approval before changes.\n';
if (command==='open-field') output += '\n## Optional open field — no execution\nExplore alternate frames, contradictions and conditions for reconsideration. Preserve existing approved decisions and commitments. Do not create tasks or change the plan without authorization.\n';
if (extra[0]) { writeFileSync(resolve(extra[0]),output,{flag:'wx'});console.log('Wrote '+extra[0]); }
else process.stdout.write(output);
