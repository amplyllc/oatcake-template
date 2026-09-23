# Component Reference

Complete documentation for all available components. Each component is structure-only HTML with `data-*` attributes ready for CSS and JavaScript.

## Layouts

### base.njk
Root HTML wrapper. Used by all other layouts.

**Variables:**
- `lang` (default: 'en') — HTML language attribute
- `direction` (default: 'ltr') — Text direction
- `title` — Page title

**Usage:**
```nunjucks
---
layout: base
title: My Page
---

<h1>Page content</h1>
```

### landing.njk
Marketing/landing page container with `.container` wrapper.

**Variables:** Same as base

**Usage:**
```nunjucks
---
layout: landing
title: Landing Page
---

{% include 'components/hero.njk' %}
<section>More content</section>
```

### event-detail.njk
Single event page with semantic `<article>` wrapper.

### article.njk
Blog post/article page.

### directory.njk
Directory/listing page (events, locations, etc).

---

## Components

### nav.njk
Header navigation with desktop and mobile variants.

**Structure:**
- `.nav__logo` — Branding area
- `.nav__links` — Desktop nav menu
- `.nav__actions` — Sign in / CTA buttons
- `.nav__toggle` — Mobile menu button
- `.nav__mobile` — Mobile menu panel

**Data attributes:** `data-component="nav"`

**CSS classes ready for styling:**
- `.nav__inner` — Header container
- `.nav__mobile-list` — Mobile link list
- `.nav__action--primary` / `--secondary` — Button variants

**Usage:**
Included automatically in base layout. Edit `src/_data/nav.json` to change links.

---

### hero.njk
Hero/banner section at top of pages.

**Variables:**
- `layout` (default: 'centered') — 'centered', 'left', 'two-column'
- `image` — Background/featured image URL
- `imageAlt` — Image alt text
- `cta` — Object with `url` and `type` ('primary' or 'secondary')

**Structure:**
- `.hero__image` — Featured image
- `.hero__content` — Text content area
- `.hero__headline` — Main heading
- `.hero__subheadline` — Subtitle
- `.hero__cta` — Call-to-action link

**Usage:**
```nunjucks
{% include 'components/hero.njk' with {
  layout: 'two-column',
  image: '/images/hero.jpg',
  imageAlt: 'Hero image',
  cta: {url: '/signup', type: 'primary'}
} %}
```

---

### event-card.njk
Individual event card with schema.org Event markup.

**Variables:**
- `image` — Event poster/cover image
- `category` — Event category tag
- `rsvp` (boolean) — Show RSVP button

**Semantic markup:**
- `itemscope itemtype="https://schema.org/Event"`
- `itemprop="name"`, `startDate`, `location`, `description`, `image`

**Structure:**
- `.event-card__image` — Cover image
- `.event-card__title` — Event name
- `.event-card__meta` — Date and location
- `.event-card__description` — Event summary
- `.event-card__category` — Category tag
- `.event-card__actions` — Links and buttons

**Usage:**
```nunjucks
{% for event in events %}
  {% include 'components/event-card.njk' with {
    image: event.image,
    category: event.category,
    rsvp: true
  } %}
{% endfor %}
```

---

### gallery.njk
Image grid/masonry gallery.

**Variables:**
- `items` — Array of image objects
  - `image` — Image URL
  - `alt` — Alt text
  - `caption` — Optional caption

**Structure:**
- `.gallery__grid` — Grid container
- `.gallery__item` — Individual image
- `.gallery__caption` — Image caption

**Usage:**
```nunjucks
{% include 'components/gallery.njk' with {
  items: [
    {image: '/img1.jpg', alt: 'Image 1', caption: 'First photo'},
    {image: '/img2.jpg', alt: 'Image 2', caption: 'Second photo'}
  ]
} %}
```

---

### linktree.njk
Link list for profiles (Linktree style) with schema.org Person markup.

**Variables:**
- `avatar` — Profile image URL
- `links` — Array of link objects
  - `url` — Link destination
  - `purpose` — Link type ('link', 'shop', 'contact', etc)
  - `icon` (boolean) — Show icon space
  - `text` — Link label

**Schema markup:** `itemscope itemtype="https://schema.org/Person"`

**Structure:**
- `.linktree__header` — Profile area
- `.linktree__avatar` — Profile image
- `.linktree__name` — Profile name
- `.linktree__links` — Link list
- `.linktree__link` — Individual link

**Usage:**
```nunjucks
{% include 'components/linktree.njk' with {
  avatar: '/profile.jpg',
  links: [
    {url: '/shop', purpose: 'shop', text: 'Shop'},
    {url: '/contact', purpose: 'contact', text: 'Contact'}
  ]
} %}
```

---

### cta-section.njk
Call-to-action section with headline and buttons.

**Variables:**
- `variant` (default: 'default') — Design variant
- `secondaryUrl` (optional) — Secondary button link

**Structure:**
- `.cta__content` — Text area
- `.cta__headline` — Main text
- `.cta__subheadline` — Secondary text
- `.cta__actions` — Button group
- `.cta__button--primary` / `--secondary` — Button variants

**Usage:**
```nunjucks
{% include 'components/cta-section.njk' with {
  variant: 'default',
  secondaryUrl: '/learn-more'
} %}
```

---

### announcement.njk
Top banner alert (dismissible).

**Variables:**
- `severity` (default: 'info') — 'info', 'warning', 'error', 'success'
- `icon` (boolean) — Show icon space

**Attributes:**
- `role="status"` — Accessibility
- `aria-live="polite"` — Screen reader announcement

**Structure:**
- `.announcement__inner` — Content wrapper
- `.announcement__icon` — Optional icon
- `.announcement__text` — Message text
- `.announcement__close` — Dismiss button

**Usage:**
```nunjucks
{% include 'components/announcement.njk' with {
  severity: 'warning',
  icon: true
} %}
```

---

### notification.njk
Toast notification bubble (appears and disappears).

**Variables:**
- `type` (default: 'info') — 'info', 'success', 'error', 'warning'

**Attributes:**
- `role="alert"` — Accessibility

**Structure:**
- `.notification__accent` — Accent color bar
- `.notification__content` — Message text

**Usage:**
```nunjucks
{% include 'components/notification.njk' with {
  type: 'success'
} %}
```

---

### tiktok-feed.njk
Vertical snap-scroll feed (like TikTok).

**Variables:**
- `slides` — Array of slide objects
  - `image` — Slide background image
  - `text` — Slide content

**Structure:**
- `.tiktok-feed__viewport` — Scrollable container (attribute: `data-scroll="snap-y"`)
- `.tiktok-feed__slide` — Individual slide
- `.tiktok-feed__media` — Slide background image
- `.tiktok-feed__overlay` — Content overlay
- `.tiktok-feed__card` — Text card
- `.tiktok-feed__controls` — Action buttons
- `.tiktok-feed__indicators` — Dot nav

**Data attributes:**
- `data-action` — Button action type (like, share, more)
- `data-index` — Slide index

**Usage:**
```nunjucks
{% include 'components/tiktok-feed.njk' with {
  slides: [
    {image: '/slide1.jpg', text: 'Slide 1'},
    {image: '/slide2.jpg', text: 'Slide 2'}
  ]
} %}
```

---

### shortcuts-grid.njk
Action button grid (Apple Shortcuts style).

**Variables:**
- `actions` — Array of action objects
  - `id` — Action identifier
  - `label` — Button label

**Structure:**
- `.shortcuts-grid__container` — Grid wrapper
- `.shortcuts-grid__item` — Action button
- `.shortcuts-grid__icon` — Icon space
- `.shortcuts-grid__label` — Button label

**Data attributes:**
- `data-action` — Action ID

**Usage:**
```nunjucks
{% include 'components/shortcuts-grid.njk' with {
  actions: [
    {id: 'post', label: 'Post'},
    {id: 'share', label: 'Share'},
    {id: 'library', label: 'Library'}
  ]
} %}
```

---

### drawer.njk
Side drawer/sidebar panel.

**Variables:** (filled via slot)

**Attributes:**
- `data-state` — 'open' or 'closed'
- `role="dialog"` — Accessibility
- `aria-modal="true"`

**Structure:**
- `.drawer__overlay` — Backdrop (clickable to close)
- `.drawer__panel` — Drawer content
- `.drawer__close` — Close button
- `.drawer__title` — Panel heading
- `.drawer__body` — Panel content

**Usage:**
```nunjucks
{% include 'components/drawer.njk' %}
```

---

### blog-post.njk
Article content wrapper with schema.org BlogPosting.

**Variables:**
- `featuredImage` — Article header image

**Schema markup:**
- `itemscope itemtype="https://schema.org/BlogPosting"`
- `itemprop="headline"`, `datePublished`, `image`, `articleBody`

**Structure:**
- `.blog-post__header` — Article metadata area
- `.blog-post__title` — Headline
- `.blog-post__meta` — Date/author info
- `.blog-post__image` — Featured image
- `.blog-post__body` — Article content

**Usage:**
```nunjucks
---
layout: article
title: My Post
featuredImage: /img.jpg
---

{% include 'components/blog-post.njk' %}

Article markdown content goes here.
```

---

## Partials

### footer.njk
Site footer with links and social icons.

**Structure:**
- `.footer__container` — Footer wrapper
- `.footer__section` — Link section (repeatable)
- `.footer__heading` — Section title
- `.footer__links` — Link list
- `.footer__bottom` — Copyright area
- `.footer__credit` — Copyright text
- `.footer__socials` — Social icon links

**Included automatically in base layout.**

---

### section-wrapper.njk
Generic section container with optional theme.

**Variables:**
- `theme` (default: 'default') — Theme variant

**Structure:**
- `.section` — Outer section
- `.section__container` — Inner content wrapper

**Usage:**
```nunjucks
{% include 'partials/section-wrapper.njk' with {
  theme: 'light'
} %}
  <h2>Section content</h2>
{% endinclude %}
```

---

## Data Attributes for Styling

All components use `data-component` and optional `data-*` attributes for CSS hooks:

```css
/* Select by component type */
[data-component="nav"] { }

/* Select by component state */
[data-component="drawer"][data-state="open"] { }

/* Select by variant/layout */
[data-component="hero"][data-layout="two-column"] { }

/* Select by category or severity */
[data-category="music"] { }
[data-severity="warning"] { }
```

This keeps CSS selectors predictable and avoids class naming conflicts.

---

## CSS Variable Customization

Edit `src/styles/_base.scss` to change:

```scss
--bg: #0f0f0f;           // Background color
--text: #fbf5f3;         // Text color
--accent: #e8622a;       // Brand accent color
--font-sans: 'DM Sans';  // Body font
--space-lg: 16px;        // Default spacing unit
--max-width: 1200px;     // Container max-width
```

All components reference these variables, so updates propagate globally.

---

## Accessibility

All components include semantic HTML and ARIA attributes:
- `role="main"` on `<main>`
- `role="status"` on announcements
- `role="alert"` on notifications
- `aria-live="polite"` on dynamic content
- `aria-label`, `aria-controls` on buttons and triggers
- `aria-modal="true"` on dialogs

Test with screen readers to ensure your content markup is complete.

---

## Next Steps

1. **Phase 2 (Styling)**: Add component-specific `.scss` files in `src/styles/components/`
2. **Phase 3 (JavaScript)**: Add interaction logic (drawer toggle, mobile menu, tiktok-feed snapping, etc)
3. **Phase 4 (Content)**: Populate with real data and copy
4. **Phase 5 (Publishing)**: Deploy to production
