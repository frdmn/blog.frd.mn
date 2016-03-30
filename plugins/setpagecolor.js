/**
 * Set pageColor
 */

module.exports = setPageColor;

/**
 * A Metalsmith plugin to set random postPageColors (specified in ./info.json
 * and ./assets/css/style.scss respectively) to collection 'posts'. Also sets
 * defaultPageColor on collection 'pages'.
 *
 * @return {Function}
 */

function setPageColor(domain) {
  var info = require('../info.json'),
      postColors = info.postPageColors,
      defaultColor = info.defaultPageColor,
      postColorIndex = 0,
      postColorMax = postColors.length - 1;

  return function(files, metalsmith, done) {
    for (var file in files) {
      _f = files[file];
      if (_f.collection == 'posts')
        _f.pageColor = postColors[postColorIndex];
      else
        _f.pageColor = defaultColor;

      if (postColorIndex >= postColorMax)
        postColorIndex = 0;
      else
        postColorIndex++;
    }
    done();
  };
};
