# Setup

## Install

Requires Node.js 18+ (11ty 3).

```bash
npm install
npm run dev     # dev server with live reload at http://localhost:8080
npm run build   # static output in _site/
npm run clean   # remove _site/
```

## Configuration

`src/_data/site.json`, available in templates as `site.*`:

| Key | Used for |
|---|---|
| `title`, `description`, `author` | `<title>`, meta, Open Graph, JSON-LD, llms.txt |
| `url` | Canonical URLs, sitemap, robots.txt, llms.txt |
| `lang` | `<html lang>` |
| `locale`, `timeZone` | Date formatting |
| `sameAs` | Organization JSON-LD `sameAs`, footer social links |

`src/_data/nav.json` holds the header links and actions. The `siteNav` macro renders them for both the desktop and mobile menus.

## Creating a page

```nunjucks
---
layout: landing
title: About
description: Page description
---
{% from "components/hero.njk" import hero %}

{{ hero() }}
```

`src/about.njk` → `/about/`. Pages are added to `sitemap.xml` and `llms.txt` automatically. Set `eleventyExcludeFromCollections: true` to leave one out.

## Adding styles

Add rules to `_layout.scss` for structure, or create your own theme partial and `@use` it from `main.scss`. Select components by their data hooks:

```scss
[data-component="drawer"][data-state="open"] { }
[data-component="hero"][data-layout="two-column"] { }
[data-purpose="featured"] { }
```

## Static files

- `src/assets/**` → `/assets/**`
- `public/**` → `/**` (site root)

## SEO and AI search

`head.njk` emits the canonical link, Open Graph and Organization JSON-LD. Pages that set `schemaEvent` in front matter also get Event JSON-LD. JSON-LD is serialized from objects with the `json` filter, which escapes `<` so values cannot close the `<script>` tag. The build also writes `/robots.txt`, `/sitemap.xml` and `/llms.txt`.

## Deployment

Build command `npm run build`, publish directory `_site`.
