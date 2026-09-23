# Template Library

A structure-first component library built with [11ty](https://www.11ty.dev/), [Nunjucks](https://mozilla.github.io/nunjucks/) and [Sass](https://sass-lang.com/). Marketing sites, web apps and native shells render the same semantic HTML.

- **12 components, 2 partials, 5 layouts**, each defined once as a Nunjucks macro
- **Structure only**: semantic HTML with descriptive placeholder text, a CSS reset and critical layout; no theme
- **SEO / AI search**: schema.org JSON-LD, Open Graph, `robots.txt`, `sitemap.xml`, `llms.txt`
- **One content contract**: a mixed feed of events, offers, heroes and announcements rendered from `GET /api/v1/content`, baked at build time and reconciled live in the browser. See [docs/CONTRACT.md](docs/CONTRACT.md)
- **Static first**: complete HTML without JS; one ~3 KB gzipped script (`hydrate.js`) patches changed items only
- **MIT licensed**

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run dev     # http://localhost:8080
npm run build   # writes _site/
API_BASE=https://api.example.com API_WORKSPACE=main npm run build
```

Without `API_BASE` the build renders `src/_data/fixtures/content.json`.

Open `/components/` to see every component rendered with its placeholders.

## Directory structure

```
src/
  _includes/
    components/      # One macro per file; registry.njk maps content type → macro
    layouts/         # base, landing, article, event-detail, directory
    partials/        # footer (include), section-wrapper (macro)
    head.njk         # Meta, Open Graph, JSON-LD
  _data/
    site.json        # Site-wide config (read as site.*)
    nav.json         # Navigation links and actions
    api.js           # Content connector (build): API → api.content, fixture fallback
    fixtures/        # Sample content in the contract shape
  styles/
    _reset.scss      # Modern reset
    _base.scss       # Layout tokens + utilities
    _layout.scss     # Critical structural layout per component
    main.scss        # Compiled to /styles/main.css
  assets/            # Copied to /assets/
    js/hydrate.js    # Content connector (browser): live reconcile; also the build's select/format
  api/content.njk    # → /api/content.json
  components.njk     # Component showcase at /components/
  index.njk          # Homepage
  robots.njk, sitemap.njk, llms.njk
public/              # Copied to the site root (/manifest.json, /browserconfig.xml)
```

## Using components

Every component is a macro. Import it, then call it:

```nunjucks
{% from "components/hero.njk" import hero %}
{% from "components/event-card.njk" import eventCard %}

{{ hero(item) }}

{% for event in events %}
  {{ eventCard(event) }}
{% endfor %}
```

Called with no arguments, a component renders descriptive placeholder text (`Hero headline`, `Event title`, …) so the structure is visible before content exists. See [docs/COMPONENTS.md](docs/COMPONENTS.md).

## Styles

`main.scss` is compiled by 11ty itself (no separate Sass step) into `/styles/main.css`. It contains only a reset, layout tokens (spacing, max-width, breakpoints) and structural layout (grid, flex, positioning, scroll snap). Color, type and decoration belong to the consuming site.

## License

MIT. See [LICENSE](LICENSE).
