/**
 * Set permalinks
 */

module.exports = setPermalink;

/**
 * A Metalsmith plugin to set permalinks
 *
 * @return {Function}
 */

function setPermalink(domain) {
  return function(files, metalsmith, done) {
    if (!metalsmith._metadata.site.url) {
      return done(new Error('Make sure metadata.site.url exists!'));
    }
    for (var file in files) {
      _f = files[file];
      _f.link = metalsmith._metadata.site.url + '/' + _f.path + '/';
    }
    done();
  };
};
