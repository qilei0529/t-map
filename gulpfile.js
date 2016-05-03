var gulp = require('gulp')
var stylus = require('gulp-stylus')
var watch = require('gulp-watch')

gulp.task('one', function() {
    watch('./src/css/*.styl', function () {
        gulp.src('./src/css/*.styl')
            .pipe(stylus())
            .pipe(gulp.dest('./public/css/'))
    });
})