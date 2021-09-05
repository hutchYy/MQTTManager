// Requires the gulp plugin
var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
// Requires the browser-sync plugin
var browserSync = require('browser-sync').create();

gulp.task('hello', function() {
  console.log('If you are reading this. It means you have successfully installed task manager and gulp.');
});

gulp.task('sass:assets', function() {
  return gulp.src('ltr/sass/assets/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('ltr/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('sass:plugins', function() {
  return gulp.src('ltr/sass/plugins/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('ltr/plugins/'))
    .pipe(browserSync.reload({
      stream: true
    }))
})


gulp.task('watch', ['browsersync', 'sass:assets', 'sass:plugins'], function(){
  gulp.watch('ltr/sass/assets/**/*.scss', ['sass:assets']); 
  gulp.watch('ltr/sass/plugins/**/*.scss', ['sass:plugins']); 
  // Other watchers
})


gulp.task('browsersync', function() {
  browserSync.init({
    server: {
      baseDir: 'ltr'
    },
  })
})