module.exports = function(eleventyConfig) {
  
  // Passthroughs
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/styles/main.css');
  eleventyConfig.addPassthroughCopy('public');

  // Watch targets
  eleventyConfig.addWatchTarget('src/styles');

  // Layout aliases
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('landing', 'layouts/landing.njk');
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');
  eleventyConfig.addLayoutAlias('event-detail', 'layouts/event-detail.njk');
  eleventyConfig.addLayoutAlias('directory', 'layouts/directory.njk');

  // Filters
  eleventyConfig.addFilter('toJSON', obj => JSON.stringify(obj));
  eleventyConfig.addFilter('dateISO', date => {
    if (!date) return '';
    return new Date(date).toISOString();
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    templateFormats: ['njk', 'json', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
};
