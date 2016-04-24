'use strict';

var pngquant = require('imagemin-pngquant'),
    glob = require('glob'),
    gulp = require('gulp'),
    fs = require('fs'),
    gulpicon = require('gulpicon/tasks/gulpicon'),
    plugins = require('gulp-load-plugins')();

var dirs = {
  bower: 'bower_components',
  css: 'assets/css',
  js: 'assets/js',
  images: 'assets/images',
  icons: 'assets/icons',
  build: 'build/assets',
}

var cachebust = new plugins.cachebust();

var info = JSON.parse(fs.readFileSync('./info.json'));

var jsdirs = [
  dirs.js + '/*.js',
  '!' + dirs.js + '/modernizr.js',
  '!' + dirs.js + '/build.js'
]

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'ie 9']
};

/**
 * error Handler function
 * See https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-100422179
 */

var reportError = function (error) {

  var lineNumber = (error.line ? error.line : false);
  var file = (error.message ? error.message.split('\n', 1)[0] : false);

  plugins.notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: (file ? file + ', ' : '') + (lineNumber ? 'Line: ' + lineNumber + ', ' : '') + 'See console for more info...',
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  plugins.util.beep(); // Beep 'sosumi' again

  // Inspect the error object
  //console.log(error);

  // Easy error reporting
  //console.log(error.toString());

  // Pretty error reporting
  var report = '';
  var chalk = plugins.util.colors.red;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  if (lineNumber) { report += chalk('LINE:') + ' ' + lineNumber + '\n'; }
  report += chalk('PROB:') + '\n' + error.message;

  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
}

gulp.task('sass:dev', function () {
  gulp.src(dirs.css + '/*.scss')
    .pipe(plugins.plumber({
      errorHandler: reportError
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(dirs.css))
    .pipe(plugins.livereload())
    .on('error', reportError);
});

gulp.task('sass', function () {
  gulp.src(dirs.css + '/*.scss')
    .pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(dirs.css))
    .pipe(plugins.livereload());
});

gulp.task('imagemin', function () {
  gulp.src(dirs.images + '/**/*')
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dirs.images));
});

gulp.task('js', function () {
  var jsdirsClone = jsdirs.slice(0);

  jsdirsClone.unshift(dirs.bower + '/clipboard/dist/clipboard.js');
  jsdirsClone.unshift(dirs.bower + '/headroom.js/dist/jQuery.headroom.js');
  jsdirsClone.unshift(dirs.bower + '/headroom.js/dist/headroom.js');
  jsdirsClone.unshift(dirs.bower + '/jquery/dist/jquery.js');

  gulp.src(jsdirsClone)
    .pipe(plugins.plumber({
      errorHandler: reportError
    }))
    .pipe(plugins.uglify())
    .pipe(plugins.concat('build.js'))
    .pipe(gulp.dest(dirs.js + '/'))
    .pipe(plugins.livereload())
    .on('error', reportError);
});

gulp.task('gulpicon',
  gulpicon(glob.sync(dirs.icons + '/**/*.svg'), {
    cssprefix: ".icon--",
    enhanceSVG: true,
    customselectors: {
      "*": [".icon--$1:before"]
    },
    dest: dirs.icons + '/grunticon'
  })
);

gulp.task('execute:build', plugins.shell.task(['node index.js']));
gulp.task('execute:dev', plugins.shell.task(['node copy_dev_assets.js']));

gulp.task('replace', function(){
  gulp.src([dirs.build + '/js/build.js'])
    .pipe(plugins.replace('DISQUS_PUBLIC_KEY', info.disqusPublicKey))
    .pipe(gulp.dest(dirs.build + '/js'));
});

gulp.task('bust:assets', function(){
  gulp.src([dirs.build + '/js/build.js'])
    .pipe(cachebust.resources())
    .pipe(gulp.dest(dirs.build + '/js'));
  gulp.src([dirs.build + '/css/*.css'])
    .pipe(cachebust.resources())
    .pipe(gulp.dest(dirs.build + '/css'));
  gulp.src([dirs.build + '/icons/**/*.css'])
    .pipe(cachebust.resources())
    .pipe(gulp.dest(dirs.build + '/icons'));
  gulp.src([dirs.build + '/images/**/*'])
    .pipe(cachebust.resources())
    .pipe(gulp.dest(dirs.build + '/images'));
});

gulp.task('bust:html', ['bust:assets'], function(){
  gulp.src([dirs.build + '/**/*.html'])
    .pipe(cachebust.references())
    .pipe(gulp.dest(dirs.build + '/'));
});

gulp.task('watch', function () {
  plugins.livereload.listen();
  gulp.watch(dirs.css + '/*.scss', ['sass:dev']);
  gulp.watch(dirs.js + '/main.js', ['js']);
  gulp.watch(dirs.icons + '/**/*.svg', ['gulpicon']);
});

gulp.task('default', ['sass', 'js', 'imagemin', 'gulpicon', 'execute:build', 'replace', 'bust:html'], function() {});
gulp.task('dev', ['default', 'watch'], function () {});
