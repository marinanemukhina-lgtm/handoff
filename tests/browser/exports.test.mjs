import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium, webkit, devices } from 'playwright';

const assets = new Map([
  ['/handoff/', ['index.html', 'text/html']],
  ['/handoff/app.js', ['app.js', 'text/javascript']],
  ['/handoff/format.js', ['format.js', 'text/javascript']]
]);
const modeLabels = { continue: 'CONTINUE', review: 'REVIEW', 'open-field': 'OPEN_FIELD' };
const statement = 'Передать макет в четверг';

test('browser handoff on mobile screens', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'handoff-exports-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const server = createServer(async (req, res) => {
    const asset = assets.get(req.url);
    if (!asset) return res.writeHead(404).end();
    const content = await readFile(new URL('../../docs/' + asset[0], import.meta.url));
    res.writeHead(200, { 'Content-Type': asset[1] + '; charset=utf-8' }).end(content);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = process.env.HANDOFF_TEST_URL || `http://127.0.0.1:${server.address().port}/handoff/`;

  for (const engine of [webkit, chromium]) {
    const browser = await engine.launch();
    try {
      for (const device of ['iPhone 13', 'iPad (gen 7)']) {
        await t.test(engine.name() + ' / ' + device, async t => {
          const { defaultBrowserType, ...profile } = devices[device];
          const context = await browser.newContext({ ...profile, acceptDownloads: true });
          t.after(() => context.close());
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', err => errors.push(err.message));
          assert.equal((await page.goto(url, { waitUntil: 'networkidle' })).status(), 200);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          const traffic = [];
          context.on('request', req => {
            if (/^https?:/.test(req.url())) traffic.push(req.url());
          });
          page.on('websocket', ws => traffic.push(ws.url()));
          await context.setOffline(true);
          const button = name => page.getByRole('button', { name, exact: true });
          const generate = () => button('Generate handoff').tap();
          async function verifyCleared() {
            for (const name of ['Download JSON', 'Download Markdown', 'Copy Markdown']) {
              assert.ok(await button(name).isDisabled(), name);
            }
            assert.equal(await page.locator('#preview').textContent(), 'Nothing generated yet.');
          }
          async function download(name, filename) {
            const [file] = await Promise.all([page.waitForEvent('download'), button(name).tap()]);
            assert.equal(file.suggestedFilename(), filename);
            const path = join(directory, filename);
            await file.saveAs(path);
            return readFile(path, 'utf8');
          }
          await verifyCleared();
          await button('Load example').tap();
          await page.locator('#project').fill('Бумажный маяк');
          await page.locator('#commitments').fill(statement + ' | Редактор | open');
          await page.locator('#approval').fill('Согласовать публикацию');
          for (const [mode, label] of Object.entries(modeLabels)) {
            await page.locator('#mode').selectOption(mode);
            await verifyCleared();
            await generate();
            const pkg = JSON.parse(await download('Download JSON', 'handoff.json'));
            const md = await download('Download Markdown', 'HANDOFF.md');
            assert.equal(pkg.mode, mode);
            assert.equal(pkg.commitments[0].statement, statement);
            assert.equal(pkg.commitments[0].owner, 'Редактор');
            assert.deepEqual(pkg.permissions.requires_approval, ['Согласовать публикацию']);
            assert.ok(md.includes('Selected: ' + label));
            assert.ok(md.includes(statement));
            assert.ok(md.includes('Согласовать публикацию'));
            assert.equal(md, await page.locator('#preview').textContent());
            assert.equal(md, execFileSync(process.execPath,
              ['bin/handoff.mjs', 'render', join(directory, 'handoff.json')], { encoding: 'utf8' }));
          }
          await page.locator('#next').fill('Пересчитать страницы');
          await verifyCleared();
          await generate();
          const updated = JSON.parse(await download('Download JSON', 'handoff.json'));
          assert.equal(updated.next.action, 'Пересчитать страницы');
          await button('Load example').tap();
          await verifyCleared();
          await page.locator('#decisions').fill('Decision without a source');
          await generate();
          await verifyCleared();
          assert.match(await page.locator('#status').textContent(), /source/);
          assert.deepEqual(errors, []);
          assert.deepEqual(traffic, []);
        });
      }
    } finally {
      await browser.close();
    }
  }
});
