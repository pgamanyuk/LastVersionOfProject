let project_folder = 'dist';
let source_folder = 'src';

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/',
        img: project_folder + '/',
        fonts: project_folder + '/fonts/'
    }, src: {
        html: [source_folder + '/**/*.html', '!' + source_folder + '/**/_*.html'],
        css: source_folder + '/scss/style.scss',
        js: source_folder + '/**/*.js',
        img: source_folder + '/**/*.{jpg, jpeg, png, svg, gif, webp}',
        fonts: source_folder + '/fonts/*.ttf'
    }, watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/scss/**/*.scss',
        js: source_folder + '/**/*.js',
        img: source_folder + '/img/**/*.{jpg, jpeg, png, svg, gif, webp}'
    }, clean: './' + project_folder + '/'
}

let { src, dest} = require('gulp');
let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let fileInclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoPrefixer = require('gulp-autoprefixer');
let groupMedia = require('gulp-group-css-media-queries');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
let webpcss = require('gulp-webp-css')
let woff = require('gulp-ttf2woff');
let woff2 = require('gulp-ttf2woff2');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: './' + project_folder + '/'
        }, port: 3001,
        notify: false
    })
}

function html() {
    return src(path.src.html)
    .pipe(fileInclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream())
}

function images() {
    return src(path.src.img)
    .pipe(webp({
        quality: 70
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img)) 
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}

function fonts() {
    src(path.src.fonts)
    .pipe(woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(woff2())
    .pipe(dest(path.build.fonts))
}

function js() {
    return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: 'expanded'
        })
    )
    .pipe(groupMedia())
    .pipe(autoPrefixer({
        cascade: true,
        overrideBrowserslist: ['last 5 versions']
    }))
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}


function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean)
}

let build = gulp.series(clean,gulp.parallel(css,html,js,images,fonts));
let watch = gulp.parallel(build, watchFiles ,browsersync);



exports.fonts = fonts; 
exports.css = css; 
exports.images = images; 
exports.html = html;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;