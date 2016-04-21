const babelify = require('babelify');
const browserify = require('browserify');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    rename: {
        'gulp-clean-css': 'minifyCss',
        'gulp-uglify': 'minifyJs',
    }
});

const DIR_COMPONENTS = 'bower_components';
const DIR_SOURCE = 'src';
const DIR_BUILD = 'dist';

const PATHS = {
    scripts: {
        src: DIR_SOURCE + '/scripts/**/*.js',
        dest: DIR_BUILD + '/assets/scripts',
    },
    styles: {
        src: DIR_SOURCE + '/styles/**/*.css',
        dest: DIR_BUILD + '/assets/styles',
    },
    templates: {
        src: DIR_SOURCE + '/templates/**/*.html',
        dest: DIR_BUILD,
    },
    vendors: {
        src: [
            DIR_COMPONENTS + '/jspdf/dist/jspdf.min.js',
        ],
        dest: DIR_BUILD + '/assets/vendors',
    },
};

/*
 * General
 */
gulp.task('default', ['clean', 'build']);
gulp.task('clean', () => del(DIR_BUILD));

/*
 * Building
 */
gulp.task('build', ['build:scripts', 'build:styles', 'build:templates', 'build:vendors']);

gulp.task('build:scripts', () => {
    const OPTIONS_BABEL = {
        presets: ['es2015'],
    };

    return browserify({ debug: true })
        .transform(babelify, OPTIONS_BABEL)
        .require('src/scripts/script.js', { entry: true })
        .bundle()

        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.minifyJs())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.scripts.dest));
});

gulp.task('build:styles', () => {
    return gulp.src(PATHS.styles.src)
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.minifyCss('style.css'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.styles.dest));
});

gulp.task('build:templates', () => {
    return gulp.src(PATHS.templates.src)
        .pipe(gulp.dest(PATHS.templates.dest));
});

gulp.task('build:vendors', () => {
    return gulp.src(PATHS.vendors.src)
        .pipe(gulp.dest(PATHS.vendors.dest));
});

/*
 * Misc
 */
gulp.task('watch', () => {
    gulp.watch(PATHS.scripts.src, ['build:scripts']);
    gulp.watch(PATHS.styles.src, ['build:styles']);
});
