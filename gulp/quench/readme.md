## Quench v5.0.0

- Adding `.babelrc` file instead of hardcoding the babel config inside of `createJsTask`.
- Upgrading babel to version 7.
- Renaming `createCssTask` to `createSassTask` to disambiguate between other css tasks.
- Removing `createJsConcatTask` in favor of configuring `createJsSimpleTask`.
- Fixing bug in `createBrowserSync` task so local.js `proxy` is respected
- Removing fileExists in favor of fs.existsSync
- Upgrading to Gulp 4
- Transpiling node_modules for IE compatibility

### v5.1.0

- Fixing bug with window machines not watching

### v5.2.0

- Adding react-hooks eslint rule

### v5.3.0

- Running quench files through prettier
- Addressing TODO in browser-sync task
- Adding glob support to match `.js` or `.jsx` files in `runJsTask.js`
- Updating readme with better Jenkins commands

### v5.4.0

- Adding task descriptions in `logHelp`
