var gulp = require('gulp');
var exec = require("child_process").exec;
var fs = require('fs');
var path = require("path");
var textlint = require('gulp-textlint');

const mdDir = './md/';
const texDir = './tex/';
const imageDir = './images/';

// png to eps
gulp.task('eps', function() {
  fs.readdir(imageDir, function(err, files) {
    if (err) throw err;
    files.filter(function (file) {
      return fs.statSync(path.join(imageDir, file)).isFile() && /.*\.png$/.test(file);
    }).forEach(function (file) {
      var cmd = `convert ${path.join(imageDir, file)} ${path.join(imageDir, path.basename(file, '.png'))}.eps`
      exec(cmd, function(err, stdout, stderr) {
        if (err) console.log("error: " + err);
        if (stdout) console.log("stdout: " + stdout);
        if (stderr) console.log("stderr: " + stderr);
      })
    })
  })
})

// Markdown to LaTex to PDF
gulp.task('build', function() {
  fs.readdir(mdDir, function(err, files) {
    if (err) throw err;
    files.filter(function (file) {
      return fs.statSync(path.join(mdDir, file)).isFile() && /.*\.md$/.test(file);
    }).forEach(function (file) {
      // markdown to LaTex
      var cmd = `pandoc ${path.join(mdDir, file)} -o ${path.join(texDir, path.basename(file,'.md'))}.tex`
      console.log(cmd)
      exec(cmd, function(err, stdout, stderr) {
        if (err) console.log("error: " + err);
        if (stdout) console.log("stdout: " + stdout);
        if (stderr) console.log("stderr: " + stderr);
      })  
    });
  })

  // LaTex to dvi
  exec("platex -kanji=UTF8 tex/thesis.tex", function(err, stdout, stderr) {
    if (err) console.log(err);
    if (stdout) console.log(stdout);
    if(stderr) console.log(stderr);

    // dvi to pdf
    exec("dvipdfmx thesis.dvi", function(err, stdout, stderr) {
      if (err) console.log(err);
      if (stdout) console.log(stdout);
      if(stderr) console.log(stderr);
      exec("mv thesis.pdf build/", function(err, stdout, stderr) {
        if (err) console.log(err);
        if (stdout) console.log(stdout);
        if(stderr) console.log(stderr);
      })
    })
  })
})


// textlint
gulp.task('textlint', function() {
  return gulp.src('./md/**/*.md')
    .pipe(textlint());
});

gulp.task('default', ['textlint', 'build']);
