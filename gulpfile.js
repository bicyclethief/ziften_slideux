// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

// tasks
gulp.task('sass', function() {
  gulp.src('./app/scss/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
});
gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
      .pipe(browserify({
        insertGlobals: true,
        debug: true
      }))
      .pipe(concat('bundled.js'))
      .pipe(gulp.dest('./app/js'))
});
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
  gulp.src('./dist/*')
      .pipe(clean({force: true}));
  gulp.src('./app/js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
      .pipe(minifyCSS(opts))
      .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
      .pipe(uglify({
        // inSourceMap:
        // outSourceMap: "app.js.map"
      }))
      .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
      .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
      .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
      .pipe(connect.reload());
});
gulp.task('js', function() {
  gulp.src('./app/*.js')
      .pipe(connect.reload());
  gulp.src('./app/controllers/*.js')
      .pipe(connect.reload());
});
gulp.task('watch', function() {
  gulp.watch('./app/**/*.html', ['html']);
  gulp.watch('./app/scss/**/*.scss', ['sass']);
});

// default task
gulp.task('default',
    ['clean', 'lint', 'browserify', 'connect', 'watch']
);
gulp.task('build', function() {
  runSequence(
      ['clean'],
      ['lint', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist']
  );
});