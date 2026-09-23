# Content contract

One data contract serves every surface: static web pages, live browser updates, embeds and the native iOS app. This library is a **consumer**: it reads the contract and never writes to it.

![From page-shaped to client-shaped API](api-contract.svg)

## Endpoints

| Endpoint | Purpose | Used here |
|---|---|---|
| `GET /api/v1/content?workspace=&type=&since=` | List content items | Build (`src/_data/api.js`) and browser (`src/assets/js/hydrate.js`) |
| `POST /api/v1/content` / `PATCH /api/v1/content/:id` | Create (idempotent) / update | No (write paths are out of scope) |
| `GET /api/v1/render?id=&format=` | One item → `image` \| `page` \| `embed` | Not yet (OG images are a later stage) |

`GET /api/v1/content` returns a **bare JSON array** of items. The static build publishes the same array at `/api/content.json`, so any consumer can read either one with the same code.

## Item shape

```json
{
  "id": "a1c3e5f7-2b4d-4e6f-8a0c-9d1e3f5a7b03",
  "type": "event",
  "slug": "late-night-jazz-trio",
  "title": "Late-night jazz trio",
  "summary": "Two sets of standards and originals.",
  "url": "/events/late-night-jazz-trio/",
  "starts_at": "2027-10-08T00:00:00Z",
  "ends_at": "2027-10-08T03:00:00Z",
  "location": { "name": "Main room", "address": "100 Example St, Springfield" },
  "media": [{ "url": "https://…/jazz.jpg", "alt": "Upright bass on stage", "width": 1200, "height": 675 }],
  "metadata": { "purpose": "music" },
  "updated_at": "2026-09-21T18:12:44Z",
  "deleted_at": null
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Stable identity; the key every client uses to compare versions |
| `type` | string | `event` \| `offer` \| `hero` \| `announcement` \| `link` \| `post` … |
| `slug` | string | URL-safe, unique per workspace |
| `title` | string | Required |
| `summary` | string \| null | One or two sentences |
| `url` | string \| null | Where the item leads (detail page, ticket link, offer page) |
| `starts_at`, `ends_at` | string \| null | UTC ISO 8601 with `Z`. Items with neither never expire |
| `location` | `{ name, address }` \| null | |
| `media` | `[{ url, alt, width, height }]` | Empty array when none; `media[0]` is the primary image |
| `metadata` | object | Always has `purpose`, the key that drives variation within a type. Other keys are type-specific (e.g. `layout` on `hero`) |
| `updated_at` | string | UTC ISO 8601. Changes on every write |
| `deleted_at` | string \| null | Only present in `since` responses (tombstone) |

**Variation rule:** a new kind of thing is a new `type` value or a new `metadata.purpose`, never a new endpoint and never a type-specific top-level field.

### `since`

`?since=<ISO timestamp>` returns items whose `updated_at` is later than that value, **including deletions as tombstones** (`deleted_at` set). Without tombstones a client could never learn that an item was removed.

### iOS (`Codable`)

The JSON above is the Swift model as-is; no adapter layer is needed.

```swift
struct ContentItem: Codable, Identifiable {
  struct Location: Codable { let name: String; let address: String? }
  struct Media: Codable { let url: URL; let alt: String?; let width: Int?; let height: Int? }
  let id: String, type: String, slug: String, title: String
  let summary: String?, url: String?
  let startsAt: Date?, endsAt: Date?
  let location: Location?, media: [Media]
  let metadata: [String: String]   // swap for a typed struct once metadata keys settle
  let updatedAt: Date, deletedAt: Date?
}

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
decoder.dateDecodingStrategy = .iso8601
```

## API requirements for the web consumer

- **CORS:** `Access-Control-Allow-Origin` for the site origin on `GET /api/v1/content`.
- **Caching:** send an `ETag` and an edge-friendly `Cache-Control`, e.g. `public, max-age=0, s-maxage=60, stale-while-revalidate=300`. The browser fetches with `cache: 'no-cache'` and no timestamp query parameter. Every request revalidates (a cheap 304 when nothing changed), browsers never show a stale copy, and all visitors share one edge cache entry per URL.

## How this library consumes it

### Configuration

| Env var | Purpose |
|---|---|
| `API_BASE` | e.g. `https://api.example.com`. Unset → fixture only, no browser reconcile |
| `API_WORKSPACE` | Sent as `?workspace=` |

### Build: instant static render

`src/_data/api.js` fetches the full list (10 s timeout) and exposes `api.content`, `api.base`, `api.workspace`, `api.source` and `api.since`. On any failure (network, non-2xx, non-array) it logs a warning and renders `src/_data/fixtures/content.json`. **The build never fails because the API is down.** `<meta name="content-source">` says which source each page was built from.

> Trade-off: an outage during a publish rebuild ships fixture content to crawlers and no-JS visitors until the next build. Browsers with JS replace it with the live list immediately (see below). If that is unacceptable in production, fail the deploy on `content-source=fixture` in CI.

`api.content` is named that way because Eleventy 3 reserves the top-level `content` data key.

### Rendering a mixed feed

```nunjucks
---
hydrate: true
---
{% from "components/registry.njk" import feed, renderItem %}

{{ feed(api.content) }}                                   {# every registered type #}
{{ feed(api.content, { type: "event", limit: 6 }) }}      {# filtered region #}
{% for item in api.content %}{{ renderItem(item) }}{% endfor %}
```

`registry.njk` maps `type` → macro (`event` → `eventCard`, `hero` → `hero`, `offer` → `ctaSection`, `announcement` → `announcement`). Unregistered types render nothing, at build time and in the browser alike.

**Adding a type:** one macro (root carries `data-type`, `data-id`, `data-updated`; field elements carry `data-slot*` attributes, see [COMPONENTS.md](COMPONENTS.md)) plus one line in the registry. Build, `<template>`s and hydration follow automatically.

### Browser: live reconcile

Pages with `hydrate: true` (and a configured `API_BASE`) get `<meta name="api-base">`, one `<template>` per registered type (the same macro rendered with no item) and a deferred `/assets/js/hydrate.js` (about 3 KB gzipped unminified, no dependencies).

1. Request `GET {API_BASE}/api/v1/content?workspace=…&since={newest updated_at in this build}`.
2. `[]` (the common case) means the page is current, and nothing else happens.
3. Otherwise merge the delta over `/api/content.json` (a delta alone cannot re-rank a region with a `limit`), then for each `[data-hydrate="content"]` region:
   - recompute membership with the region's `data-type` / `data-purpose` / `data-limit` (the same `select()` the build used);
   - keep nodes whose `id` and `updated_at` match; fill changed ones **in place**; clone new ones from their `<template>`; remove the rest; move nodes only when out of order;
   - keep the first visible surviving item fixed on screen so inserts above the fold don't move the reader.
4. If the build used the fixture, `since` is omitted, and the full live list replaces the sample data.

**Fail-safe:** every fetch, parse, shape check and plan step runs before the first DOM write. Any error leaves the static render untouched.

**Limit:** items that end between builds drop out only when a reconcile runs (a non-empty delta). Schedule a daily build-hook call to clear expired items without one.

## Publish → rebuild

```
Editor publishes/updates an item
  → API writes the row, bumps updated_at
  → API POSTs the host's build hook (Netlify / Vercel / Cloudflare Pages deploy hook URL)
  → host runs `npm run build` with API_BASE set
  → fresh HTML + /api/content.json deploy to the edge
```

Visitors between the publish and the new deploy still see the change, because `hydrate.js` fetches it with `since`. The rebuild makes it permanent for crawlers, no-JS visitors and link previews. Debounce the hook on the API side (e.g. 30–60 s) so a burst of edits triggers one build.
