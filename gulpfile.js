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
		commonCss: [
			staticRoot + 'css/src/bootstrap.css',
			staticRoot + 'css/src/font-awesome.css',
			staticRoot + 'css/src/agency.css'
		],
		commonJs: [
			nodeModulesRoot + 'jquery/dist/jquery.js',
			nodeModulesRoot + 'jquery-lazyload/jquery.lazyload.js',
			nodeModulesRoot + 'jquery.easing/jquery.easing.js',
			nodeModulesRoot + 'bootstrap/dist/bootstrap.js',
			nodeModulesRoot + 'bootstrap/js/transition.js',
			nodeModulesRoot + 'bootstrap/js/collapse.js',
			jsRoot + 'src/agency.js'
		],
		less: [
			staticRoot + 'less/'
		],
		css: staticRoot + 'css/src/',
		cssDist: staticRoot + 'css/dist/',
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

gulp.task('compile-bootstrap-less', function() {
	return gulp.src(nodeModulesRoot + 'bootstrap/less/bootstrap.less')
		.pipe(plumber(function(error) {
			gutil.beep();
			gutil.log(error);
		}))
		.pipe(less({
			plugins: [cleanCSS]
		})).
		pipe(gulp.dest(paths.css));
});

gulp.task('compile-font-awesome-less', function() {
	gulp.src(nodeModulesRoot + 'font-awesome/less/font-awesome.less')
		.pipe(plumber(function(error) {
			gutil.beep();
			gutil.log(error);
		}))
		.pipe(less({
			plugins: [cleanCSS]
		})).
		pipe(gulp.dest(paths.css));

	// copy fonts to correct location
	gulp.src(nodeModulesRoot + 'font-awesome/fonts/*-webfont.*')
		.pipe(gulp.dest(staticRoot + 'css/fonts/'));
});

gulp.task('distribute-js', function() {
	gulp.src(jsRoot + 'src/*')
		.pipe(uglify())
		.pipe(gulp.dest(paths.jsDist));
});

gulp.task('build-common-css', function() {
	return gulp.src(paths.commonCss)
		.pipe(concat('common.min.css'))
		.pipe(gulp.dest(paths.cssDist));
});

// concatenate common libraries into one file
gulp.task('build-common-js', function() {
	return gulp.src(paths.commonJs)
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

gulp.task('build', ['build-common-js', 'build-common-css', 'distribute-js']);

gulp.task('runKeystone', shell.task('node keystone.js'));

gulp.task('watch', ['watch:lint'], function() {
	gulp.watch(paths.less + '*.less', ['compile-less']).on('change', reportChange);
});

gulp.task('default', ['watch', 'runKeystone']);
