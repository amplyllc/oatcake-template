const path = require('node:path');
const sass = require('sass');
const site = require('./src/_data/site.json');

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const formatDate = (iso) =>
  new Intl.DateTimeFormat(site.locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: site.timeZone }).format(new Date(iso));

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  // Mapped to the root so /manifest.json and /browserconfig.xml resolve where head.njk points.
  eleventyConfig.addPassthroughCopy({ public: '/' });

  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    // Stylesheets are build outputs, not pages; keeps them out of the sitemap and llms.txt.
    getData: async () => ({ eleventyExcludeFromCollections: true }),
    compile(inputContent, inputPath) {
      // Partials only exist to be @use'd; emitting them would ship dead CSS files.
      if (path.basename(inputPath).startsWith('_')) return;
      const result = sass.compileString(inputContent, {
        loadPaths: [path.dirname(inputPath)],
        style: 'compressed',
      });
      this.addDependencies(inputPath, result.loadedUrls);
      return () => result.css;
    },
  });

  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('landing', 'layouts/landing.njk');
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');
  eleventyConfig.addLayoutAlias('event-detail', 'layouts/event-detail.njk');
  eleventyConfig.addLayoutAlias('directory', 'layouts/directory.njk');

  // For JSON inside HTML (<script>): escaping "<" stops a value containing "</script>" from
  // closing the tag. Standalone .json outputs use Nunjucks' built-in `dump` instead.
  eleventyConfig.addFilter('json', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
  // Slot contract shared with every content macro: a real item (has an id) renders its value or
  // nothing; an empty call (showcase, hydrate <template>) renders the descriptive placeholder.
  eleventyConfig.addFilter('slot', (item, path, placeholder = '', format) => {
    if (!item || !item.id) return placeholder;
    const value = get(item, path);
    if (value == null || value === '') return '';
    return format === 'date' ? formatDate(value) : value;
  });
  eleventyConfig.addFilter('hidden', (item, path, evenAsPlaceholder = false) => {
    const empty = !item || get(item, path) == null || get(item, path) === '';
    return empty && (evenAsPlaceholder || (item && item.id)) ? ' hidden' : '';
  });
  eleventyConfig.addFilter('dateISO', (date) => (date ? new Date(date).toISOString() : ''));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
