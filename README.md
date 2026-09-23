# Template Library

A lightweight, structure-first component library built with [11ty](https://www.11ty.dev/), [Nunjucks](https://mozilla.github.io/nunjucks/), and [Sass](https://sass-lang.com/). Designed for rapid prototyping of marketing sites, web apps, and native mobile shells — all consuming the same semantic HTML templates.

## Features

- **Component-first**: 15+ reusable Nunjucks components
- **Structure-only**: HTML + minimal CSS baseline (no styling bloat)
- **Mobile-first**: Responsive by default, CSS/JS-agnostic
- **SEO-ready**: Built-in schema.org, Open Graph, Twitter Card, and AI indexing metadata
- **Zero runtime**: Static output, zero JavaScript framework overhead
- **FOSS**: MIT licensed, fully open source

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Install

```bash
git clone https://github.com/yourusername/template-library.git
cd template-library
npm install
```

### Develop

```bash
npm run dev
```

Starts a local dev server at `http://localhost:8080`. Watch for changes in `src/styles` and `src/_includes`.

### Build

```bash
npm run build
```

Outputs static site to `_site/`.

## Directory Structure

```
src/
  _includes/
    components/      # Reusable Nunjucks components
    layouts/         # Page layout templates
    partials/        # Footer, header fragments
    head.njk         # Comprehensive meta/schema head
  _data/
    global.json      # Site-wide config
    nav.json         # Navigation structure
  styles/
    _reset.scss      # CSS reset
    _base.scss       # Utilities + CSS variables
    main.scss        # Imports, component hooks (phase 2)
  assets/            # Images, fonts, icons (phase 2)
  index.njk          # Homepage

public/
  manifest.json      # PWA manifest
  browserconfig.xml  # Windows tile config

.eleventy.js         # 11ty configuration
package.json         # Dependencies & scripts
README.md            # This file
```

## Components

### Layouts
- **base.njk** — Root HTML + nav + footer wrapper
- **landing.njk** — Marketing page container
- **event-detail.njk** — Single event page
- **article.njk** — Blog post wrapper
- **directory.njk** — Listing/directory page

### Components
- **nav.njk** — Header navigation (desktop + mobile)
- **hero.njk** — Hero banner section
- **event-card.njk** — Individual event card (with schema.org)
- **gallery.njk** — Image grid/masonry gallery
- **linktree.njk** — Linktree-style link list
- **cta-section.njk** — Call-to-action block
- **announcement.njk** — Top banner alert
- **notification.njk** — Toast/notification bubble
- **tiktok-feed.njk** — Vertical snap-scroll feed
- **shortcuts-grid.njk** — Apple Shortcuts dashboard
- **drawer.njk** — Side drawer/sidebar
- **blog-post.njk** — Article content wrapper

### Partials
- **footer.njk** — Footer component
- **section-wrapper.njk** — Generic section container

## Data

### Global Configuration
Edit `src/_data/global.json` to customize site-wide settings:
```json
{
  "title": "Your Site Title",
  "description": "Your site description",
  "siteName": "Branding",
  "author": "Your Name",
  "social": {
    "twitter": "yourhandle",
    "github": "yourusername"
  }
}
```

### Navigation
Edit `src/_data/nav.json` to customize the header navigation links and actions.

## Metadata & SEO

The `head.njk` component includes:
- Open Graph tags (social media sharing)
- Twitter Card metadata
- Schema.org JSON-LD (Organization, Event, BlogPosting)
- Favicon + PWA manifest
- Apple touch icons
- Google & Bing bot directives
- AI content creator directives

**Per-page overrides:** Pass metadata as frontmatter in any layout:
```yaml
---
title: My Page
description: Page-specific description
ogImage: https://example.com/image.jpg
schemaEvent:
  name: My Event
  startDate: 2026-09-23
  locationName: Syracuse, NY
---
```

## Styles

### CSS Architecture
- **_reset.scss** — Browser defaults normalization
- **_base.scss** — CSS custom properties + utility classes
- **main.scss** — Imports all, with placeholders for phase 2 component styles

### Color Palette
```css
--bg: #0f0f0f;
--surface: #1a1a1a;
--surface-2: #222;
--border: #2a2a2a;
--text: #fbf5f3;
--text-muted: #777;
--accent: #e8622a;
--success: #44ff88;
--error: #e8622a;
```

### Customize
Edit `src/styles/_base.scss` to adjust colors, spacing, typography, and breakpoints.

## Usage Examples

### Basic Landing Page
```nunjucks
---
layout: landing
title: Welcome
description: My landing page
---

{% include 'components/hero.njk' %}

<section class="py-xl">
  <div class="container">
    <h2>Our Services</h2>
  </div>
</section>

{% include 'components/cta-section.njk' %}
```

### Event Listing
```nunjucks
---
layout: directory
title: Upcoming Events
---

<h1>Events</h1>

{% for event in events %}
  {% include 'components/event-card.njk' %}
{% endfor %}
```

### Blog Post
```nunjucks
---
layout: article
title: Blog Post Title
description: Post description
featuredImage: /assets/image.jpg
---

{% include 'components/blog-post.njk' %}

Post content goes here. Markdown is supported in `.md` files using the template engine.
```

## Roadmap (Phase 2)

- Component-specific Sass modules
- Form components (input, button, select, checkbox, textarea)
- Table/list layouts (profiles, settings, activity logs)
- JavaScript layer (modal interactions, drawer toggle, tiktok-feed snapping)
- Extended utility classes (animations, responsive helpers)

## License

MIT © Your Name. See LICENSE file for details.

## Contributing

Contributions welcome! Please fork, create a feature branch, and submit a PR.

## Support

- [11ty Documentation](https://www.11ty.dev/)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [Sass Documentation](https://sass-lang.com/)

---

**Built with** 🔨 **11ty** + **Nunjucks** + **Sass**
