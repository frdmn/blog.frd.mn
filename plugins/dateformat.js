/**
 * Format dates
 */

module.exports = dateFormat;

/**
 * A Metalsmith plugin to format the date
 *
 * @return {Function}
 */

function dateFormat() {
  var month = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  return function(files, metalsmith, done) {
    for (var file in files) {
      _f = files[file];
      if (_f.date) {
        var date = new Date(_f.date),
        day = date.getDate();
        index = date.getMonth();
        year = date.getFullYear();

        _f.date = day + '. ' + month[index] + ' ' + year;
      }
    }
    done();
  };
};
