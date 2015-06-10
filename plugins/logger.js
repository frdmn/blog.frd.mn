/**
 * Logger
 */

module.exports = logger;

/**
 * A Metalsmith plugin to log files or metadata
 *
 * @return {Function}
 */

function logger(scope, child) {
  return function(files, metalsmith, done) {
    if (scope == 'metadata') {
      console.log((child ? metalsmith._metadata[child] : metalsmith._metadata));
    } else {
      for (var file in files) {
        console.log((child ? files[file][child] : files[file]));
      }
    }
    done();
  };
};
