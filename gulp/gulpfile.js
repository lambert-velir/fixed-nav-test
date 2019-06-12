/**
 *  See ./readme.md for usage
 **/
const quench = require("./quench/quench.js");

const projectRoot = quench.resolvePath(__dirname, "..");

const createBuildTask = require("./tasks/build.js");

/**
 * gulp build
 *
 * to build for production/jenkins:
 *    node_modules/.bin/gulp build --no-watch --env production
 */
const build = createBuildTask(projectRoot);
build.description = "Build frontend assets";
exports.build = build;

exports.default = quench.logHelp;
