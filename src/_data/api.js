// Content connector, build half. Bakes the live contract into the static render; the build must
// never fail because the API is down, so any failure falls back to the fixture and says so.
const fixture = require('./fixtures/content.json');

const base = (process.env.API_BASE || '').replace(/\/+$/, '');
const workspace = process.env.API_WORKSPACE || '';

const result = (content, source) => ({
  base,
  workspace,
  source,
  content,
  // Lets the browser ask only for what changed after this build. Empty for the fixture, whose
  // timestamps say nothing about the live data.
  since: source === 'api' ? content.reduce((max, it) => (it.updated_at > max ? it.updated_at : max), '') : '',
});

module.exports = async function () {
  if (!base) {
    console.warn('[api] API_BASE not set; rendering fixture content');
    return result(fixture, 'fixture');
  }
  const url = new URL('/api/v1/content', base);
  if (workspace) url.searchParams.set('workspace', workspace);
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const content = await res.json();
    if (!Array.isArray(content)) throw new Error('response is not an array');
    return result(content, 'api');
  } catch (err) {
    console.warn(`[api] ${url} failed (${err.message}); rendering fixture content`);
    return result(fixture, 'fixture');
  }
};
