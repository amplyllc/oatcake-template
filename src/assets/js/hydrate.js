/*
 * Content connector, browser half. Pages ship a complete static render; this reconciles it with
 * the live API. The same file is require()d by .eleventy.js so region selection and date
 * formatting have one implementation for build and browser.
 */
(() => {
  'use strict';

  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const isEmpty = (v) => v == null || v === '';
  const time = (iso) => (iso ? Date.parse(iso) : -Infinity);

  const formatDate = (iso, locale, timeZone) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(d);
  };

  // Region membership and order. Undated items (hero, announcement) lead; dated ones run soonest
  // first; ended or deleted items drop out.
  const select = (items, { types, purpose, limit } = {}, now = Date.now()) => {
    const out = items
      .filter((it) => it && it.id && !it.deleted_at)
      .filter((it) => !types || types.includes(it.type))
      .filter((it) => !purpose || (it.metadata && it.metadata.purpose === purpose))
      .filter((it) => {
        const end = it.ends_at || it.starts_at;
        return !end || time(end) >= now;
      })
      .sort((a, b) => time(a.starts_at) - time(b.starts_at));
    return limit ? out.slice(0, limit) : out;
  };

  const lib = { get, select, formatDate };
  if (typeof module === 'object' && module.exports) {
    module.exports = lib;
    return;
  }

  const meta = document.querySelector('meta[name="api-base"]');
  const regions = [...document.querySelectorAll('[data-hydrate="content"]')];
  if (!meta || !meta.content || !regions.length) return;
  const cfg = meta.dataset;

  // Markup comes only from <template>s rendered by the same macros as the static page, so this
  // file never holds HTML strings and a macro change reaches both paths at once.
  const templates = {};
  for (const t of document.querySelectorAll('template[data-type]')) templates[t.dataset.type] = t;

  const regionFilter = (region) => ({
    types: region.dataset.type ? region.dataset.type.split(',') : Object.keys(templates),
    purpose: region.dataset.purpose || '',
    limit: Number(region.dataset.limit) || 0,
  });

  // data-slot-<attr>="path" → attribute; data-slot="path" → text; data-show="path" → visibility.
  const fill = (node, item) => {
    for (const el of [node, ...node.querySelectorAll('*')]) {
      for (const [key, path] of Object.entries(el.dataset)) {
        if (!key.startsWith('slot') || key === 'slot') continue;
        const attr = key.slice(4).replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());
        const value = get(item, path);
        if (isEmpty(value)) el.removeAttribute(attr);
        else el.setAttribute(attr, value);
      }
      if (el.dataset.slot != null) {
        let value = get(item, el.dataset.slot);
        if (!isEmpty(value) && el.dataset.format === 'date') value = formatDate(value, cfg.locale, cfg.timeZone);
        el.textContent = isEmpty(value) ? '' : String(value);
        el.hidden = isEmpty(value);
      }
      if (el.dataset.show != null) el.hidden = isEmpty(get(item, el.dataset.show));
    }
    Object.assign(node.dataset, {
      id: item.id,
      type: item.type,
      updated: item.updated_at || '',
      purpose: (item.metadata && item.metadata.purpose) || '',
    });
  };

  // Pure planning: reads the DOM and builds detached nodes, never mutates the live page. Any
  // throw here (bad data, unknown shape) aborts before the first write, so the static render
  // survives intact.
  const plan = (items) =>
    regions.map((region) => {
      const existing = new Map();
      for (const n of region.children) if (n.dataset.id) existing.set(n.dataset.id, n);
      const patches = [];
      const nodes = select(items, regionFilter(region))
        .filter((item) => templates[item.type])
        .map((item) => {
          const node = existing.get(item.id);
          if (node && node.dataset.type === item.type) {
            existing.delete(item.id);
            if (node.dataset.updated !== (item.updated_at || '')) patches.push([node, item]);
            return node;
          }
          const fresh = templates[item.type].content.firstElementChild.cloneNode(true);
          fill(fresh, item);
          return fresh;
        });
      return { region, nodes, patches, stale: [...existing.values()] };
    });

  // Patches nodes in place instead of an innerHTML wipe: untouched nodes keep focus, media
  // load state, listeners and any per-node UI state; only changed ones are written.
  const apply = (plans) => {
    const anchor = scrollAnchor(new Set(plans.flatMap((p) => p.stale)));
    for (const { region, nodes, patches, stale } of plans) {
      for (const [node, item] of patches) fill(node, item);
      for (const node of stale) node.remove();
      nodes.forEach((node, i) => {
        if (region.children[i] !== node) region.insertBefore(node, region.children[i] || null);
      });
    }
    restoreScroll(anchor);
  };

  // Inserts above the fold would shove the reader down; pin the first visible item that will
  // survive the patch instead. (CSS overflow-anchor does this natively but not in Safari.)
  const scrollAnchor = (leaving) => {
    if (!window.scrollY) return null;
    for (const n of document.querySelectorAll('[data-hydrate="content"] > [data-id]')) {
      if (leaving.has(n)) continue;
      const top = n.getBoundingClientRect().top;
      if (top >= 0) return { node: n, top };
    }
    return null;
  };
  const restoreScroll = (a) => {
    if (a && a.node.isConnected) window.scrollBy(0, a.node.getBoundingClientRect().top - a.top);
  };

  // cache: 'no-cache' revalidates with the edge every time (ETag → cheap 304) and never shows a
  // stale browser copy. No timestamp query param: every visitor shares one edge cache key, which
  // is what keeps the API cheap under traffic.
  const getJSON = (url) =>
    fetch(url, { cache: 'no-cache', headers: { Accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('content is not an array');
        return data;
      });

  const url = new URL('/api/v1/content', meta.content);
  if (cfg.workspace) url.searchParams.set('workspace', cfg.workspace);
  // `since` is the newest updated_at baked into this build, so the usual answer is [] and the
  // page is already current. It is omitted when the build fell back to the fixture, forcing a
  // full list that replaces the sample data.
  if (cfg.since) url.searchParams.set('since', cfg.since);

  getJSON(url)
    .then((live) => {
      if (!cfg.since) return live;
      if (!live.length) return null;
      // A delta alone cannot re-rank a limited region, so merge it over the baked full list.
      return getJSON('/api/content.json').then((baked) => [
        ...new Map([...baked, ...live].map((it) => [it.id, it])).values(),
      ]);
    })
    .then((items) => items && apply(plan(items)))
    .catch(() => {
      // Deliberately silent: the static render is already a complete page.
    });
})();
