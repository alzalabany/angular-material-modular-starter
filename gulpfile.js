
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');


var folders = ['./modules/**/*.js', './modules/**/*.css'];
 
gulp.task('wire', function () {
  
  var target = gulp.src('./index.html');
  var sources = gulp.src(folders, {read: false});
 
  return target.pipe(wiredep()).pipe(inject(sources,{addRootSlash: false}))
    .pipe(gulp.dest('./'));
});



gulp.task('default', ['wire']);