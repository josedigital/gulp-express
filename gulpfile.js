'use strict';

var env         = require('minimist')(process.argv.slice(2));
var gulp        = require('gulp');
var broswerSync = require('browser-sync');
var nodemon     = require('gulp-nodemon');
var plumber     = require('gulp-plumber');
var pug         = require('gulp-pug');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var gulpif      = require('gulp-if');
var stylus      = require('gulp-stylus');
var rupture     = require('rupture');
var yeticss     = require('yeticss');
var axis        = require('axis');
var prefixer    = require('autoprefixer-stylus');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
// look into deploying with gulp
// http://mikeeverhart.net/2016/01/deploy-code-to-remote-servers-with-gulp-js/



// call pug to compile templates
gulp.task('pug', function () {
  return gulp.src('src/templates/*.pug')
    .pipe(plumber())
    .pipe(pug({pretty: !env.p}))
    .pipe(gulp.dest('public/'));
});

gulp.task('copy', function() {
  return gulp.src(['src/*.html', 'src/*.txt'])
    .pipe(gulp.dest('public/'));
});

// lossless optimizers for images
gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('public/img'));
});

// stylus - files must be in src/css/
// files will be moved to public/css/
gulp.task('stylus', function () {
  gulp.src('src/css/styles.styl')
  .pipe(plumber())
  .pipe(stylus({
    use:[prefixer(), yeticss(), axis(), rupture()],
    compress: env.p,
  }))
  .pipe(gulp.dest('public/css'));
});

// concat all js
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulpif(env.p, uglify()))
    .pipe(gulp.dest('public/js'));
});

// call uglify and concat js
gulp.task('browserify', function () {
  return gulp.src('src/js/main.js')
    .pipe(plumber())
    .pipe(browserify({debug: !env.p}))
    .pipe(gulpif(env.p, uglify()))
    .pipe(gulp.dest('public/js'));
});

// nodemon - start and keep from restarting server
gulp.task('nodemon', function(callback) {
  return nodemon({
    script: 'src/app.js'
  }).once('start', callback);
});

gulp.task('watch', function () {
  gulp.watch('src/templates/**/*.pug', ['pug']);
  gulp.watch('src/css/**/*.styl', ['stylus']);
  gulp.watch('src/js/**/*.js', [(env.fy) ? 'browserify' : 'js']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
});

// sync dev actions with browser - browser-sync -> which calls nodemon
gulp.task('browser-sync', ['nodemon'], function() {
  broswerSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 4000
  });
});


// Default task
gulp.task('default', [(env.fy) ? 'browserify' : 'js', 'pug', 'copy', 'stylus', 'imagemin', 'watch', 'browser-sync']);
