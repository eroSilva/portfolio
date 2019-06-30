const { series, parallel, src, dest, watch  } = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const bs = require('browser-sync');
const del = require('del');

const paths = {
    root: 'src',
    styles: 'src/scss/**/*.scss',
    icons: 'src/icons/**/*.svg',
    images: 'src/img/**/*.{png,jpeg,jpg,svg,gif,ico}',
    dest: {
        root: 'dist',
        styles: 'dist/css',
        images: 'dist/img',
        fonts: 'dist/fonts'
    }
};

const clean = () => {
    return del(paths.dest.root);
}

const extras = () => {
    return src([`${paths.root}/*.*`, `${paths.root}/favicon/**/*.*`], {base: paths.root})
        .pipe($.plumber())
        .pipe(dest(paths.dest.root))
}

const styles = () => {
    return src(paths.styles)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.postcss([
            mqpacker({ sort: true }),
            autoprefixer(),
            cssnano()
        ]))
        .pipe($.rename(`app.min.css`))
        .pipe($.sourcemaps.write())
        .pipe(dest(paths.dest.styles));
}

const images = () => {
    return src(paths.images)
        .pipe($.plumber())
        .pipe($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(dest(paths.dest.images));
}

const icons = () => {
    const fontName = 'erosilva-icons';

    return src(paths.icons)
		.pipe($.iconfontCss({
			fontName,
			path: path.resolve('src/icons/template.scss'),
			targetPath: path.resolve('src/scss/objects/_icons.scss'),
			fontPath: '../fonts/',
		}))
		.pipe($.iconfont({
			fontName,
			normalize: true,
			fontHeight: 1000,
			centerHorizontally: true,
			formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'],
			prependUnicode: false
		}))
		.pipe(dest(paths.dest.fonts));
}

const serve = () => {
    watch(`${paths.root}/*.*`, extras);
    watch(paths.styles, styles);
    watch(paths.icons, icons);
    watch(paths.images, images);
}

const sync = () => bs({
    files: [`${paths.dest.root}/**`],
    server: {baseDir: './dist'}
});

exports.clean = clean;
exports.extras = extras;
exports.styles = styles;
exports.icons = icons;

exports.default = series(
    clean,
    icons, 
    parallel(images, styles, extras),
    parallel(serve, sync)
);

exports.build = series( clean, icons, images, styles, extras );