import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = name => readFileSync(new URL('../docs/' + name, import.meta.url), 'utf8');
const releasedAddress = 'https://marinanemukhina-lgtm.github.io/handoff/';

function exactlyOne(text, pattern, label) {
  const matches = [...text.matchAll(pattern)];
  assert.equal(matches.length, 1, label + ' must occur once');
  return matches[0][1];
}

test('public metadata and sitemap agree with the intended production address', () => {
  const expected = process.env.HANDOFF_PUBLIC_URL || releasedAddress;
  const entry = new URL(expected);
  assert.equal(entry.protocol, 'https:');
  assert.equal(entry.href, expected);
  assert.equal(entry.search + entry.hash + entry.username + entry.password, '');
  assert.ok(entry.pathname.endsWith('/'));

  const html = read('index.html');
  const canonical = exactlyOne(html, /<link rel="canonical" href="([^"]+)">/g, 'canonical');
  const ogUrl = exactlyOne(html, /<meta property="og:url" content="([^"]+)">/g, 'og:url');
  const jsonLd = JSON.parse(exactlyOne(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, 'WebApplication JSON-LD'));
  const sitemap = exactlyOne(read('sitemap.xml'), /<loc>([^<>]+)<\/loc>/g, 'sitemap loc');

  assert.equal(canonical, expected, 'canonical URL');
  assert.equal(ogUrl, expected, 'social URL');
  assert.equal(jsonLd['@type'], 'WebApplication');
  assert.equal(jsonLd.url, expected, 'structured data URL');
  assert.equal(jsonLd['@id'], expected + '#builder', 'structured data identifier');
  assert.equal(sitemap, expected, 'sitemap URL');
});
