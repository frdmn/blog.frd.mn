/**
 * Set page slug
 */

module.exports = setSlug;

/**
 * A Metalsmith plugin to set pageslug.
 * Sets slug to title if slug isn't specified.
 *
 * @return {Function}
 */

function setSlug() {
 return function(files, metalsmith, done) {
   for (var file in files) {
     _f = files[file];

     if (!_f.slug) {
       _f.slug = _f.title;
     }
   }
   done();
 };
};
