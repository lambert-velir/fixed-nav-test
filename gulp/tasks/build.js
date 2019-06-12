const gulp = require("gulp");
const quench = require("../quench/quench.js");
const runCopyTask = require("../quench/runCopyTask.js");
const runJsTask = require("../quench/runJsTask.js");
const runSassTask = require("../quench/runSassTask.js");
const runBrowserSyncTask = require("../quench/runBrowserSyncTask.js");

module.exports = function createBuildTasks(projectRoot) {
  const buildDir = `${projectRoot}/build`;
  const clientDir = `${projectRoot}/client`;

  const copy = () =>
    runCopyTask({
      src: [`${clientDir}/index.html`],
      dest: buildDir,
      base: `${clientDir}`
    });

  const js = () =>
    runJsTask({
      dest: `${buildDir}/js/`,
      files: [
        {
          entry: `${clientDir}/js/index.js?(x)`, // .js or .jsx
          filename: "index.js",
          watch: [`${clientDir}/js/**/*.js`, `${clientDir}/js/**/*.jsx`]
        },
        {
          entry: `${clientDir}/polyfill/index.js`,
          filename: "polyfill.js",
          watch: [`${clientDir}/polyfill/**`]
        }
      ]
    });

  const sass = () =>
    runSassTask({
      src: [`${clientDir}/scss/**/*.scss`, `${clientDir}/js/**/*.scss`],
      dest: `${buildDir}/css/`,
      watch: [`${clientDir}/scss/**/*.scss`, `${clientDir}/js/**/*.scss`],
      filename: "index.css"
    });

  const image = () =>
    runCopyTask({
      src: [`${clientDir}/img/**/*.{jpg,png,gif}`],
      dest: `${buildDir}`,
      base: `${clientDir}`
    });

  const browserSync = () =>
    runBrowserSyncTask({
      server: buildDir
    });

  const buildTasks = gulp.parallel(copy, sass, image, js);

  if (quench.isWatching()) {
    return gulp.series(buildTasks, browserSync);
  }
  else {
    return buildTasks;
  }
};
