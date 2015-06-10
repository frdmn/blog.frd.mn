var Metalsmith   = require('metalsmith'),
    markdown     = require('metalsmith-markdown'),
    templates    = require('metalsmith-templates'),
    collections  = require('metalsmith-collections'),
    permalinks   = require('metalsmith-permalinks'),
    feed         = require('metalsmith-feed'),
    sitemap      = require('metalsmith-sitemap'),
    Handlebars   = require('handlebars'),
    fs           = require('fs'),
    logger       = require('./plugins/logger'),
    setPermalink = require('./plugins/setpermalink'),
    setTemplate  = require('./plugins/settemplate'),
    fixPath      = require('./plugins/fixpath'),
    dateFormat   = require('./plugins/dateformat');

/**
 * Info JSON
 */

var info = require('./info.json');

/**
 * siteInfo helper
 */

Handlebars.registerHelper('siteInfo', function (context) {
  return info[context];
});

Metalsmith(__dirname)

  /**
   * Add metadata
   */
  .metadata({
    site: {
      title: info.title,
      author: info.author,
      description: info.description,
      url: info.url
    }
  })

  /**
   * Build collections from posts and pages
   */
  .use(collections({
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))

  /**
   * Set default templates
   */
  .use(setTemplate({
    default: 'default.hbt',
    post: {
      pattern: 'post',
      template: 'post.hbt'
    },
    index: {
      pattern: 'index',
      template: 'frontpage.hbt'
    }
  }))

  /**
   * Use markdown
   */
  .use(markdown())

  /**
   * Format dates
   */
  .use(dateFormat())

  /**
   * Build permalinks
   */
  .use(permalinks({
    relative: false,
    pattern: ':title'
  }))

  /**
   * Fix path for frontpage
   */
  .use(fixPath('title', 'Home'))

  /**
   * Add 'link' prop containing permalink
   */
  .use(setPermalink())

  /**
   * Render pages
   */
  .use(templates({
    engine: 'handlebars',
    directory: 'templates',
    partials: {
      nav: 'partials/nav',
      header: 'partials/header',
      footer: 'partials/footer'
    }
  }))

  /**
   * Build sitemap
   */
  .use(sitemap({
    output: 'sitemap.xml',
    hostname: info.url
  }))

  /**
   * Build RSS Feed
   */
  .use(feed({
    collection: 'posts',
    destination: 'rss/rss.xml'
  }))

  /**
   * Set build destination
   */
  .destination('./build')
  .use(logger('metadata'))
  /**
   * Set build destination
   */
  .build(function(err) {
    if (err) throw err;
  });
