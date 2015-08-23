/**
 * copy_dev_assets is used to copy assets to build
 * destination without running the whole build process.
 */

var fs = require('fs-extra');

fs.copy('./assets', './build/assets', function (err) {
  if (err) return console.error(err)
  console.log('success!')
});
