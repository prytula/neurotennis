var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	axis = require('axis'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	each = require('gulp-each'),
	pug = require('gulp-pug'),
    eslint = require('gulp-eslint'),
	browserSync = require('browser-sync').create();

	var sizeOf = require('image-size');
	const cheerio = require('cheerio');

gulp.task('serve', function() {

	browserSync.init({
		server: {
			baseDir: "../"
		},
		port: 8080,
		notify: true
	});

	gulp.watch("../frontend/pug/*.pug", gulp.series('pug'));
	gulp.watch("../frontend/scss/**/*.scss", gulp.series('sass'));
	gulp.watch("../frontend/js/*.js", gulp.series('js'));
});


gulp.task('pug',  function() {
	return gulp.src('../frontend/pug/*.pug')
		.pipe(pug({pretty: true}))
		// .pipe(each(function(content, file, callback) {
		// 	if (file.isNull()) {
		// 		this.push(file);
		// 		return callback();
		// 	}
	
		// 	if (file.isBuffer()) {
		// 		const $ = cheerio.load(String(file.contents));
				
		// 		function getImgSize(sourceSrc){
		// 			return sizeOf(sourceSrc);
		// 		}
		// 		$('img').each((index, element) => {
		// 			const $el = $(element);
		// 			const sourceSrc = '../'+$el.attr('src');
		// 			const size = getImgSize(sourceSrc);
					
		// 			$el.attr('width', size.width);
		// 			$el.attr('height', size.height);
		// 		});
				
	
		// 		const output = $.html();
		// 		// console.log(output);
	
		// 		file.contents = Buffer.from(output);
	
		// 		return callback(null, file.contents);
		// 	}
		// }))
		.pipe(gulp.dest('../'))
		.pipe(browserSync.stream());
});

gulp.task('sass',  function(){
	return gulp.src('../frontend/scss/main.scss')
		.pipe(sass({use: [axis()]}))
		.pipe(cssnano())
		.pipe(autoprefixer(
			['> 0.5%', 'last 2 versions',"ie >= 9", 'Firefox >= 3'],
			{cascade: true,add: true }
		))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('../public/css/'))
		.pipe(browserSync.stream());
});

gulp.task('js',  function() {
	return gulp.src('../frontend/js/*.js')
		.pipe(concat('main.min.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('../public/js/'))
		.pipe(browserSync.stream());
});





gulp.task('lint', gulp.series('js', function () {
	return gulp.src('../frontend/js/*.js')
		.pipe(eslint({configFile: './eslintrc.js'}))
		.pipe(eslint.format())
		.pipe(eslint.results(results => {
			// Called once for all ESLint results.
			console.log(`Total Results: ${results.length}`);
			console.log(`Total Warnings: ${results.warningCount}`);
			console.log(`Total Errors: ${results.errorCount}`);
		}))
		.pipe(eslint.failOnError());
}));

gulp.task('prod', gulp.series('lint'));

gulp.task('default', gulp.series('pug', 'sass', 'js', 'serve'));
