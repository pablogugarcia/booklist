const gulp = require("gulp");
const gprint = require("gulp-print").default;
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json", { noEmitOnError: true });

const dirs = ["applicationRoot", "modules", "util"];

gulp.task("ts", () => {
  var failed = false;
  return gulp
    .src(["./reactStartup.ts", ...dirs.map(f => `./${f}/**/*.ts`), ...dirs.map(f => `./${f}/**/*.tsx`)], { base: "./" })
    .pipe(tsProject())
    .pipe(gprint(filePath => "TypeScript compiled: " + filePath))
    .pipe(gulp.dest(""))
    .on("finish", () => {});
});
