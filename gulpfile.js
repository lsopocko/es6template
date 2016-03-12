var gulp 			= require('gulp'),
	babelify 		= require('babelify'),
	browserify 		= require('browserify'),
	compass        	= require('gulp-compass'),
	autoprefixer   	= require('gulp-autoprefixer'),
	minifycss      	= require('gulp-minify-css'),
	rename         	= require('gulp-rename'),
	concat         	= require('gulp-concat'),
	buffer 			= require('vinyl-buffer'),
	source 			= require('vinyl-source-stream'),
	sourcemaps 		= require('gulp-sourcemaps'),
	uglify 			= require('gulp-uglify');


gulp.task('styles', function() {
  return  gulp.src(['scss/**/*.scss'])
          .pipe(compass({
            config_file: 'config.rb',
            css: 'css',
            sass: 'scss',
            image: 'img'
          }))
          .pipe(gulp.dest('css'))
          .pipe(minifycss())
          .pipe(autoprefixer())
          .pipe(gulp.dest('css'));
});

gulp.task('build', function () {
    var bundler = browserify({
        entries: 'src/app.js',
        debug: true
    });
    bundler.transform(babelify, {presets: ["es2015"]});

    bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});


gulp.task('default', ['build', 'styles'], function(){
	gulp.watch('scss/**/*.scss', ['styles']);
	gulp.watch(['src/**/*.js'], ['build']);
});