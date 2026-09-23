# Component reference

12 components and 2 partials. Each one is a Nunjucks macro, and the macro is the only place its HTML exists. Import what you use:

```nunjucks
{% from "components/event-card.njk" import eventCard %}
```

Every component carries `data-component="…"` as its styling hook. Called without data, it renders descriptive placeholder text naming each element (`Hero headline`, `Event venue name`, …).

## Content components

These take one `item` in the content contract shape (see [CONTRACT.md](CONTRACT.md)). Every field-bearing element is marked with a slot attribute, so the same markup can be filled at build time or patched in the browser:

| Attribute | Meaning |
|---|---|
| `data-slot="path"` | Text content comes from `path` (e.g. `title`, `location.name`); hidden when empty |
| `data-format="date"` | Text is the formatted date |
| `data-slot-href` / `-src` / `-alt` / `-datetime` | That attribute comes from `path` |
| `data-show="path"` | Element is hidden when `path` is empty |

The root element also carries `data-id`, `data-updated`, `data-type` and `data-purpose`.

| Macro | File | Type | Fields used |
|---|---|---|---|
| `eventCard(item)` | `event-card.njk` | `event` | title, summary, starts_at, location.name, media[0], url, metadata.purpose. Schema.org Event microdata |
| `hero(item)` | `hero.njk` | `hero` | title, summary, media[0], url, metadata.layout (`centered` \| `left` \| `two-column`) |
| `ctaSection(item)` | `cta-section.njk` | `offer` | title, summary, url |
| `announcement(item)` | `announcement.njk` | `announcement` | title, url. `role="status"` |

```nunjucks
{{ eventCard({ id: "evt_1", type: "event", title: "Opening night", starts_at: "2026-10-02T23:00:00Z" }) }}
```

## Structural components

| Macro | File | Arguments |
|---|---|---|
| `siteNav(nav, site)` | `nav.njk` | `nav.json` data + `site`. Called by the base layout |
| `blogPost(post)` + `{% call %}` body | `blog-post.njk` | `{ title, date, image, imageAlt }`. Schema.org BlogPosting |
| `drawer(options)` + `{% call %}` body | `drawer.njk` | `{ id, title }`. `data-state="open|closed"`, `role="dialog"` |
| `gallery(items, layout)` | `gallery.njk` | `[{ image, alt, caption }]` |
| `linktree(profile)` | `linktree.njk` | `{ avatar, name, links: [{ url, text, purpose }] }` |
| `notification(options)` | `notification.njk` | `{ type, message }`. `role="alert"` |
| `shortcutsGrid(actions)` | `shortcuts-grid.njk` | `[{ id, label }]` |
| `tiktokFeed(slides)` | `tiktok-feed.njk` | `[{ image, title, text }]`. Vertical scroll snap |

```nunjucks
{% from "components/blog-post.njk" import blogPost %}

{% call blogPost({ title: title, date: page.date }) %}
  {{ content | safe }}
{% endcall %}
```

## Partials

| Partial | Usage |
|---|---|
| `partials/footer.njk` | `{% include %}`. Used by the base layout; social links come from `site.sameAs` |
| `partials/section-wrapper.njk` | `{% from "partials/section-wrapper.njk" import section %}` then `{% call section('light') %}…{% endcall %}` |

## Layouts

`base` (html, head, nav, main, footer), `landing`, `article`, `event-detail` and `directory`. The last four wrap `base`. Set one with `layout:` in front matter.
