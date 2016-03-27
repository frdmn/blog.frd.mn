var Metalsmith   = require('metalsmith'),
    markdown     = require('metalsmith-markdown'),
    templates    = require('metalsmith-templates'),
    collections  = require('metalsmith-collections'),
    permalinks   = require('metalsmith-permalinks'),
    feed         = require('metalsmith-feed'),
    sitemap      = require('metalsmith-sitemap'),
    assets       = require('metalsmith-assets'),
    Handlebars   = require('handlebars'),
    fs           = require('fs'),
    logger       = require('./plugins/logger'),
    setPermalink = require('./plugins/setpermalink'),
    setSlug      = require('./plugins/setslug'),
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
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: 'pages/*.md'
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
  .use(markdown({
    langPrefix: ''
  }))

  /**
   * Format dates
   */
  .use(dateFormat())

  /**
   * set page slug to title if missing
   */
  .use(setSlug())

  /**
   * Build permalinks
   */
  .use(permalinks({
    relative: false,
    pattern: ':slug'
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
   * Build RSS Feed
   */
  .use(feed({
    collection: 'posts',
    destination: 'rss/rss.xml',
    postDescription: function(file) {
      return file.contents;
    }
  }))

  /**
   * Render pages
   */
  .use(templates({
    engine: 'handlebars',
    directory: 'templates',
    partials: {
      nav: 'partials/nav',
      archive: 'partials/archive',
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
   * Set build destination
   */
  .destination('./build')
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  //.use(logger('metadata'))
  /**
   * Set build destination
   */
  .build(function(err) {
    if (err) throw err;
  });
