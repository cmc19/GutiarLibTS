/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/gulp-concat/gulp-concat.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />
/// <reference path="typings/Browserify/Browserify.d.ts" />

import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as browserify from 'browserify';
import * as sm from 'gulp-sourcemaps';
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


var tsProject = ts.createProject({
	sortOutput: true,
	module: 'commonjs',
	target: 'ES5',
	typescript: require('typescript'),
	//sourceRoot:'./src'
});


gulp.task('default', ['bundle0', 'bundle1']);
gulp.task('watch', ['default'], () => {
	gulp.watch(['src/**/*.ts'], ['default']);
});

gulp.task("build", function() {
	return gulp
		.src(['src/**/*.ts'])
		.pipe(sm.init())
		.pipe(ts(tsProject))
		.pipe(sm.write( {
			includeContext: true,
			sourceRoot:'src'
			}))
		.pipe(gulp.dest('out'));
});

bundleify(0, 'out/Index.js', 'app.js');
bundleify(1, 'out/Test/main.js', 'Test/main.js');


var idx = 0;
function bundleify(id: number, file: string, outfile: string) {
	gulp.task('bundle' + id, ['build'], function() {
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
