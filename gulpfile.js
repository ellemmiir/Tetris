

const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "docs/"
    },
    notify: false
  });
}

function styles() {
  return src('docs/scss/style.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('docs/css'))
    .pipe(browserSync.stream())
}

function images() {
  return src('docs/img/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest('dist/img'))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'docs/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('docs/js'))
    .pipe(browserSync.stream())
}

function build() {
  return src([
    'docs/**/*.html',
    'docs/css/style.min.css',
    'docs/js/main.min.js',
    'docs/fonts/**/*'
  ], { base: 'docs' })
    .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['docs/scss/**/*.scss'], styles);
  watch(['docs/js/**/*.js', '!docs/js/main.min.js'], scripts);
  watch(['docs/**/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);