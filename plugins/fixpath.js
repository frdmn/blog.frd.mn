/**
 * Fix path
 */

module.exports = fixPath;

/**
 * A Metalsmith plugin to fix missing path property on index page.
 *
 * Usage:
 *
 * .use(fixPath('title', 'Home'))
 *
 * @return {Function}
 */


function fixPath(prop, val) {
  return function(files, metalsmith, done) {

    for (var file in files) {
      if (files[file][prop] === val)
        files[file].path = '/';
    }

    done();
  };
};
