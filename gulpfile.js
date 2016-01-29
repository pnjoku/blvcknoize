var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch'),
	shell = require('gulp-shell'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
  	cleanCSS = new LessPluginCleanCSS({ advanced: true }),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	mocha = require('gulp-mocha');


var staticRoot = 'static/',
	jsRoot = staticRoot + 'js/',
	nodeModulesRoot = 'node_modules/',
	paths = {
	src :['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],
	common: [
			nodeModulesRoot + 'jquery/dist/jquery.js',
			nodeModulesRoot + 'bootstrap/dist/bootstrap.js',
			nodeModulesRoot + 'bootstrap/js/transition.js',
			nodeModulesRoot + 'bootstrap/js/collapse.js',
			nodeModulesRoot + 'bootstrap/js/carousel.js',
			nodeModulesRoot + 'jquery-lazyload/jquery.lazyload.js',
			jsRoot + 'src/base.js'
		],
	less: staticRoot + 'less/',
	css: staticRoot + 'css/',
	jsDist: jsRoot + 'dist/'
};

function reportChange(event){
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// compile Less to CSS
gulp.task('compile-less', function() {
  return gulp.src(paths.less + '*.less')
    .pipe(plumber(function(error) {
      gutil.beep();
      gutil.log(error);
    }))
    .pipe(less({
        plugins: [cleanCSS]
      }))
    .pipe(gulp.dest(paths.css));
});

// concatenate common libraries into one file
gulp.task('build-common-lib', function() {
	return gulp.src(paths.common)
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.jsDist));
});

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

gulp.task('test', function() {
    return gulp.src('tests/*.js', { read: false })
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'nyan'
        }))
        .once('error', function(error) {
			console.log(error);
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
});

gulp.task('runKeystone', shell.task('node keystone.js'));

gulp.task('watch', ['watch:lint'], function() {
	gulp.watch(paths.less + '*.less', ['compile-less']).on('change', reportChange);
});

gulp.task('default', ['watch', 'runKeystone']);
