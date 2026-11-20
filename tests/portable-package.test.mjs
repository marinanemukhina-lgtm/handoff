import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const example = JSON.parse(readFileSync('examples/sample.json', 'utf8'));

function run(t, command, pkg) {
  const dir = mkdtempSync(join(tmpdir(), 'handoff-cli-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, 'handoff.json');
  writeFileSync(file, JSON.stringify(pkg));
  return spawnSync(process.execPath, ['bin/handoff.mjs', command, file], { encoding: 'utf8' });
}

test('older v0.3 packages show the default mode and flag missing commitment text', t => {
  const result = run(t, 'render', example);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Selected: CONTINUE/);
  assert.match(result.stdout, /Statement not recorded/);
  assert.match(result.stdout, /Example project owner/);
});

test('render preserves mode, obligation, status, owner and due date', t => {
  const commitment = { id: 'C1', statement: 'Сверить макет', owner: 'Редактор', status: 'open', due: '2026-12-01' };
  const result = run(t, 'render', { ...example, mode: 'review', commitments: [commitment] });
  assert.equal(result.status, 0, result.stderr);
  for (const value of Object.values(commitment)) assert.ok(result.stdout.includes(value));
  assert.match(result.stdout, /Selected: REVIEW/);
  assert.match(result.stdout, /Optional review/);
});

test('an explicit analysis command overrides the saved mode', t => {
  const result = run(t, 'open-field', { ...example, mode: 'review' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Selected: OPEN_FIELD/);
  assert.doesNotMatch(result.stdout, /## Optional review/);
});

test('unrecognized modes fail validation', t => {
  const result = run(t, 'validate', { ...example, mode: 'unknown' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown handoff mode/);
});
