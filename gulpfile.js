const { series, parallel, src, dest, watch  } = require('gulp');
const $ = require('gulp-load-plugins')();
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const bs = require('browser-sync');
const del = require('del');

const paths = {
    root: 'src',
    styles: 'src/scss/**/*.scss',
    images: 'src/img/**/*.{png,jpeg,jpg,svg,gif,ico}',
    dest: {
        root: 'dist',
        styles: 'dist/css',
        images: 'dist/img'
    }
};

const clean = () => {
    return del(paths.dest.root);
}

const extras = () => {
    return src([`${paths.root}/*.*`, `${paths.root}/fonts/**/*.*`,  `${paths.root}/favicon/**/*.*`], {base: paths.root})
        .pipe($.plumber())
        .pipe(dest(paths.dest.root))
}

const styles = () => {
    return src(paths.styles)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.postcss([
            mqpacker({ sort: true }),
            autoprefixer(),
            cssnano()
        ]))
        .pipe($.rename(`app.min.css`))
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

const serve = () => {
    watch(`${paths.root}/*.*`, extras);
    watch(paths.styles, styles);
    watch(paths.images, images);
}

const sync = () => bs({
    files: [`${paths.dest.root}/**`],
    server: {baseDir: './dist'}
});

exports.clean = clean;
exports.extras = extras;
exports.styles = styles;
exports.default = series(
    clean, 
    parallel(images, styles, extras),
    parallel(serve, sync)
);