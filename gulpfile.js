'use strict';
//variables
const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));;
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");


//search paths
const files = {
    htmlPath: "src/**/*.html",
    //path for main.js
    jsPath1: "src/js/main.js",
    //path for login.js
    jsPath2: "src/js/login.js",
   sassPath: "src/css/*.scss"
}

//SASS task
function sassTask(){
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(dest('pub/css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(browsersync.stream());
    

}


//HTML task, copy html
function copyHTML(){
    return src(files.htmlPath)
    .pipe(dest('pub'));
}



//JS task
function jsTask1(){
    return src(files.jsPath1)
    .pipe(babel({
        presets: ["@babel/preset-env"]
      }))
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('pub/js/main'));
}

function jsTask2(){
    return src(files.jsPath2)
    .pipe(babel({
        presets: ["@babel/preset-env"]
      }))
    .pipe(concat('login.js'))
    .pipe(terser())
    .pipe(dest('pub/js/login'));
}



//watch task
function watchTask(){
    browsersync.init({
        server: "./pub"
    });
    watch([files.htmlPath, files.sassPath, files.jsPath1, files.jsPath2], parallel(copyHTML, sassTask, jsTask1, jsTask2)).on('change', browsersync.reload);
}

exports.default = series(
    parallel(copyHTML, sassTask, jsTask1, jsTask2),
    watchTask
);

