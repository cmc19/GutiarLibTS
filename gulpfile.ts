/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/gulp-concat/gulp-concat.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />
/// <reference path="typings/Browserify/Browserify.d.ts" />
/// <reference path="typings/glob/glob.d.ts" />
/// <reference path="typings/gulp-rename/gulp-rename.d.ts" />

import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as browserify from 'browserify';
import * as sm from 'gulp-sourcemaps';
import * as glob from 'glob';
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');

var transform = require('vinyl-transform');

import rename = require('gulp-rename');

var tsProject = ts.createProject({
    module: 'commonjs',
    target: 'ES5',
    typescript: require('typescript'),
    declarationFiles: true
});

var tsProject2 = ts.createProject({
    module: 'commonjs',
    target: 'ES5',
    typescript: require('typescript'),
    declarationFiles: true
});


gulp.task('default', ['bundle0', 'bundle1']);
gulp.task('watch', ['default'], () => {
    gulp.watch(['src/**/*.ts'], ['default']);
});

gulp.task("build", function() {
    var g = gulp
        .src(['src/**/*.ts'])
        .pipe(sm.init())
        .pipe(ts(tsProject));

    g.dts.pipe(gulp.dest('out'));

    g.js
        .pipe(sm.write({
            includeContext: true,
            sourceRoot: 'src'
        }))
        .pipe(gulp.dest('out'));
});

bundleify(0, 'out/Index.js', 'app.js');
bundleify(1, 'out/Test/main.js', 'Test/main.js');


var idx = 0;
function bundleify(id: number, file: string, outfile: string) {
    gulp.task(`bundle${id}`, ['build'], function() {
        // set up the browserify instance on a task basis
        var b = browserify({
            entries: [file],
            debug: true,
            paths: ['scripts'],

        });

        return b.bundle()
            .pipe(source(outfile))
            .pipe(buffer())
            .pipe(gulp.dest(''));
    });
}


gulp.task('samples-build', ['build'], function() {
    gulp.src(['samples/**/*.ts'])
        .pipe(ts(tsProject2)).js
        .pipe(gulp.dest('Samples'));
});

gulp.task('samples-bundle', ['samples-build'], function() {
    const taskPath = ['Samples/**/*.js'];


    var files = glob.sync(taskPath[0]);

    files.forEach(filepath => {
        var bundledStream = through();
        var fileParts = filepath.split('/');
        var directory = fileParts.slice(0,  fileParts.length -1).join('/');
        var filename = fileParts[fileParts.length -1].replace('.js','.out.js');
        if(filename == 'app.js') return;

        bundledStream
            .pipe(source(filename))
            .pipe(buffer())
            .pipe(gulp.dest(directory));

        globby(taskPath, function(err, entries) {
            if (err) {
                bundledStream.emit('error', err);
                return;
            }

            var b = browserify({
                entries: [filepath],
                debug: true,
                paths: ['scripts'],

            });
            b.bundle().pipe(bundledStream);
        });
    });



});
