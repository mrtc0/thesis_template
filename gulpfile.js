var gulp = require('gulp');
var exec = require("child_process").exec;
var fs = require('fs');
var path = require("path");
var textlint = require('gulp-textlint');

const mdDir = './md/';
const texDir = './tex/';
 
gulp.task('hello', function() {
  console.log('Hello gulp!');
});

gulp.task('build', function() {
  fs.readdir(mdDir, function(err, files) {
    if (err) throw err;
    files.filter(function (file) {
      return fs.statSync(path.join(mdDir, file)).isFile() && /.*\.md$/.test(file);
    }).forEach(function (file) {
      var cmd = `pandoc ${path.join(mdDir, file)} -o ${path.join(texDir, path.basename(file,'.md'))}.tex`
      console.log(cmd)
      exec(cmd, function(err, stdout, stderr) {
        if (err) console.log("error: " + err);
        if (stdout) console.log("stdout: " + stdout);
        if (stderr) console.log("stderr: " + stderr);
      })  
    });
  })

  // Create
  exec("platex -kanji=UTF8 morita.tex", function(err, stdout, stderr) {
    if (err) console.log(err);
    if (stdout) console.log(stdout);
    if(stderr) console.log(stderr);

    exec("dvipdfmx morita.dvi", function(err, stdout, stderr) {
      if (err) console.log(err);
      if (stdout) console.log(stdout);
      if(stderr) console.log(stderr);
    })
  })
})

gulp.task('textlint', function() {
  return gulp.src('./md/**/*.md')
    .pipe(textlint());
});

gulp.task('default', ['hello']);
