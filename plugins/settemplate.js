/**
 * Set templates
 */

module.exports = setTemplate;

/**
 * A Metalsmith plugin to set default and individual templates files
 *
 * @return {Function}
 */

function setTemplate(config) {
  var keys = Object.keys(config);
  if (keys.indexOf('default') > -1) {
    keys.splice(keys.indexOf('default'), 1);
  }
  return function(files, metalsmith, done) {
    for (var file in files) {
      if(!files[file].template) {
        var _f = files[file];
        _f.template = config.default;

        keys.forEach(function(key) {
          var pattern = new RegExp(config[key].pattern),
              template = config[key].template;

          if (pattern.test(file)) {
            _f.template = template;
          }
        });
      }
    }
    done();
  };
};
