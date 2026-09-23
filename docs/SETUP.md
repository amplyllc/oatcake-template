# Setup Guide

Get started with Template Library in minutes.

## Prerequisites

- **Node.js** 16+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

## Installation

1. **Extract the repository**
   ```bash
   unzip template-library.zip
   cd template-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Opens at `http://localhost:8080` with live reload enabled.

4. **Build for production**
   ```bash
   npm run build
   ```

   Outputs a static site to `_site/` folder.

## Configuration

### Site Settings
Edit `src/_data/global.json`:
```json
{
  "title": "My Site",
  "siteName": "My Brand",
  "author": "Your Name",
  "social": {
    "twitter": "@yourhandle",
    "github": "yourname"
  }
}
```

### Navigation
Edit `src/_data/nav.json` to customize header links and buttons.

### Theme Colors
Edit `src/styles/_base.scss`:
```scss
:root {
  --bg: #0f0f0f;           // Background
  --accent: #e8622a;       // Brand color
  --text: #fbf5f3;         // Text color
  // ... more variables
}
```

## File Structure

```
src/
  _includes/
    components/       # 15+ reusable components
    layouts/         # Page layouts
    partials/        # Reusable fragments
    head.njk         # SEO & metadata
  _data/
    global.json      # Site config
    nav.json         # Navigation
  styles/
    _reset.scss      # CSS reset
    _base.scss       # Variables & utilities
    main.scss        # Imports
  assets/            # Images, fonts, icons (add here)
  index.njk          # Homepage

public/              # Static files (manifest, favicon)
docs/                # Documentation
```

## Creating a New Page

1. Create a `.njk` file in `src/`:
   ```nunjucks
   ---
   layout: landing
   title: My Page
   description: Page description
   ---

   {% include 'components/hero.njk' %}

   <h1>Page content</h1>
   ```

2. File automatically becomes a page:
   - `src/about.njk` → `/about/`
   - `src/events/index.njk` → `/events/`

## Using Components

All components are in `src/_includes/components/`:

```nunjucks
<!-- Simple include (no variables) -->
{% include 'components/announcement.njk' %}

<!-- Include with variables -->
{% include 'components/hero.njk' with {
  layout: 'two-column',
  image: '/images/hero.jpg',
  cta: {url: '/signup', type: 'primary'}
} %}

<!-- Loop through data -->
{% for event in events %}
  {% include 'components/event-card.njk' with event %}
{% endfor %}
```

See `docs/COMPONENTS.md` for complete component reference.

## Adding Styling

Phase 2: Add component-specific styles.

1. Create `src/styles/components/` directory
2. Add files like `_nav.scss`, `_hero.scss`, etc.
3. Import in `src/styles/main.scss`:
   ```scss
   @import 'components/nav';
   @import 'components/hero';
   ```

4. Style using semantic selectors and CSS variables:
   ```scss
   .nav {
     background: var(--surface);
     padding: var(--space-lg);
   }

   .nav__logo {
     color: var(--accent);
   }
   ```

## Adding JavaScript

Phase 3: Add interactivity.

1. Create `src/assets/js/` directory
2. Add script files (e.g., `drawer.js`, `mobile-menu.js`)
3. In `src/_includes/layouts/base.njk`, import before `</body>`:
   ```html
   <script src="/assets/js/drawer.js"></script>
   <script src="/assets/js/mobile-menu.js"></script>
   ```

## Adding Static Assets

Place images, fonts, icons in `src/assets/`:
- `src/assets/images/` → Available at `/assets/images/`
- `src/assets/icons/` → Available at `/assets/icons/`
- `src/assets/fonts/` → Available at `/assets/fonts/`

Then reference in HTML:
```html
<img src="/assets/images/photo.jpg" alt="Photo">
<link href="/assets/fonts/custom.woff2" rel="preload">
```

## SEO & Metadata

All pages include comprehensive SEO by default (in `head.njk`):
- OpenGraph tags (social sharing)
- Twitter Card metadata
- Schema.org structured data
- Favicon + PWA manifest
- Google/Bing/AI bot directives

**Per-page overrides** in frontmatter:
```yaml
---
title: My Event
description: Event details
ogImage: /images/event.jpg
ogType: event
schemaEvent:
  name: My Event
  startDate: 2026-09-23
  locationName: Syracuse, NY
---
```

## Deployment

### To Vercel (Recommended)
1. Push repo to GitHub
2. Import in [Vercel](https://vercel.com/import)
3. Select "11ty" preset
4. Deploy!

### To Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `_site`
4. Deploy!

### To any static host
Run `npm run build`, then upload `_site/` folder.

## Troubleshooting

**Port 8080 already in use:**
```bash
npm run dev -- --port 3000
```

**Cache issues:**
```bash
npm run clean && npm run build
```

**Changes not showing:**
Stop the dev server (Ctrl+C) and restart:
```bash
npm run dev
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Customize `global.json` and `nav.json`
3. ✅ Review `docs/COMPONENTS.md`
4. ✅ Create your first page
5. ⬜ Add styling (phase 2)
6. ⬜ Add interactivity (phase 3)
7. ⬜ Deploy!

## Resources

- [11ty Documentation](https://www.11ty.dev/)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [Sass Documentation](https://sass-lang.com/)
- [Schema.org Reference](https://schema.org/)
- [OpenGraph Protocol](https://ogp.me/)

## Support

Found a bug or have a feature request? [Open an issue on GitHub](https://github.com/yourusername/template-library/issues).

---

**Happy building!** 🚀
