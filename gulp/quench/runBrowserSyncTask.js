const quench = require("./quench.js");
const R = require("ramda");
const chalk = require("chalk");
const browserSync = require("browser-sync");

module.exports = function runBrowserSyncTask(userConfig = {}) {
  const localConfig = quench.loadLocalJs();

  if (!userConfig.server && !userConfig.proxy && !localConfig.proxy) {
    quench.throwError(
      "Browser-sync requires a `server` path or `proxy` in userConfig, or a `proxy` defined in local.js!\n",
      `Was given userConfig: ${JSON.stringify(userConfig, null, 2)}\n`,
      `and config from local.js: ${JSON.stringify(localConfig, null, 2)}`
    );
  }

  const defaults = {
    port: localConfig.browserSyncPort || 3000,
    open: false, // false or  "external"
    notify: false,
    ghostMode: false,

    // watch these default files and reload the browser when they change
    // can be overwritten by userConfig
    files: userConfig.server
      ? [
        userConfig.server + "/**",
        // prevent browser sync from reloading twice when the regular file (eg. index.js)
        // and the map file (eg. index.js.map) are generated
        "!**/*.map"
      ]
      : undefined,

    // set the server root, or proxy if it's set in local.js
    // use proxy if you have a server running the site already (eg, IIS)
    // http://www.browsersync.io/docs/options/#option-proxy
    proxy: localConfig.proxy || userConfig.proxy || undefined

    // if not using proxy, use userConfig.server as the server root
    // http://www.browsersync.io/docs/options/#option-server
  };

  // proxy is taken care of in the defaults
  const browserSyncSettings = R.mergeDeepRight(
    defaults,
    R.omit(["proxy"], userConfig)
  );

  // only run browser-sync if we're also watching
  if (quench.isWatching()) {
    quench.logYellow(
      "watching",
      "browserSync:",
      JSON.stringify(browserSyncSettings.files, null, 2)
    );

    try {
      // returning a promise https://gulpjs.com/docs/en/getting-started/async-completion
      return new Promise((resolve, reject) => {
        browserSync.create().init(browserSyncSettings, resolve);
      });
    }
    catch (e) {
      quench.throwError(
        "There was an error starting browser sync.  Is there something wrong with your settings?\n ",
        "browserSyncSettings: ",
        chalk.white(JSON.stringify(browserSyncSettings, null, 2))
      );
    }
  }
  else {
    quench.logYellow(
      "warning",
      "Browser-sync task was called, but watch is false."
    );
    return Promise.resolve();
  }
};
