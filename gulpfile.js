const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const sync = require("browser-sync").create();
const svgstore = require("gulp-svgstore");
// const ghPages = require('gulp-gh-pages');


// Style

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

const stylesmin = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}


// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}



// Images

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}


// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}


// Sprite

const sprite = () => {
  return gulp.src("source/img/svg/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;


// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}


// Clean

const clean = () => {
  return del("build");
};


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}


// Reload

const reload = done => {
  sync.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch("source/sass/**", gulp.series(build, reload));
  gulp.watch("source/*.html", gulp.series(html, reload));
}


// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    stylesmin,
    html,
    sprite,
    copy,
    images,
    createWebp
  ));


// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    stylesmin,
    html,
    sprite,
    copy,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));


// // Pg-pages
// gulp.task('deploy', function () {
//   return gulp.src("./build/**/*")
//     .pipe(ghPages());
// });

exports.styles = styles;
exports.stylesmin = stylesmin;
exports.images = images;
exports.createWebp = createWebp;
exports.copy = copy;
exports.server = server;
exports.build = build;
