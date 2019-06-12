# Gulp

## Setup

### Once per computer

1.  Install LTS version of node from [https://nodejs.org/](https://nodejs.org/)
2.  Install gulp globally:  
    `npm install -g gulp-cli`

### Once per project

1.  Navigate to the folder containing `package.json`, normally in the the project root.
2.  Install node dependancies via
    `npm install`

This will add gulp and all the other packages that it
needs to compile css, etc. All these dependancies get installed to the
`node_modules` folder. If things get messed up, you can delete this
folder and reinstall.

## Running tasks

1.  Navigate to the folder containing `gulpfile.js`, normally in the project.

2.  Run `gulp` to run the default task or `gulp [taskname]` to run a specific task. Often, `gulp` will print a list of available tasks.

The actual gulp tasks will vary by project. Look in `gulpfile.js` for exports. Any exported functions from `gulpfile.js` will be registered into gulp's task system. See https://gulpjs.com/docs/en/getting-started/creating-tasks

The watcher will normally start a [browserSync](https://browsersync.io/) server. The console will tell you the exact port, but it usually runs on [http://localhost:3000/](http://localhost:3000/).

### Watching

All tasks will watch by default. What they watch is configured on a task by task basis.

To disable watching, use `--no-watch` when you run the `gulp` command.

> `quench.isWatching()` is available to get this value programmatically in a gulp task.  
> `quench.setDefaults()` is available to set the default value to false if needed.  
> `quench.maybeWatch()` will start a watcher if the value of watch is true.

### Environments

You can set the environments by using `--env [anotherEnv]` when you run the `gulp` command. Valid environments are `local`, `development`, `production`. `local` is used by default.

> `quench.getEnv()` is available to get this value programmatically in a gulp task. See https://github.com/gunpowderlabs/gulp-environments for usage.  
> `quench.setDefaults()` is available to set the default environment if needed.

### Continuous Integration

For Jenkins, or other continuous integrations, it's common to run the tasks without watching and for the production environment. Also, to avoid relying on the global `gulp` command, it's advisable to run gulp directly from the `node_modules` folder. For example:

```
node_modules/.bin/gulp build --no-watch --env production
```

### `local.js`

Occasionally, it's helpful for developers to have a configuration specific to their machine. For example, if a gulp task needs to proxy an already running site. For these types of configuration, we can use `local.js`. This file should export a javascript object with configuration values.

To access this configuration inside a gulp task, you can use `quench.loadLocalJs()`:

```javascript
const localConfig = quench.loadLocalJs();
```

See [`local.js.example`](./local.js.example) for an example. This file is already set up with `proxy` and `browserSyncPort` values, which are used by [`runBrowserSyncTask.js`](./quench/runBrowserSyncTask.js). See [`runBrowserSyncTask.js`](./quench/runBrowserSyncTask.js) for an example of how to use `quench.loadLocalJs()`.

`local.js` should **not** be checked in to source control.

## Writing tasks

To write tasks, you'll need an understanding of [Gulp v4](https://gulpjs.com/). Read through the [getting started](https://gulpjs.com/docs/en/getting-started/quick-start) documentation and become familiar with gulp's [API](https://gulpjs.com/docs/en/api/concepts).

### The `/quench` folder

The `/quench` folder contains `quench.js`, which provides helper functions for various things. See [`quench.js`](./quench/quench.js) for more details, it's well documented.

The `/quench` folder also contains various `run*Task.js` helper functions for common tasks. These include [`runSassTask`](./quench/runSassTask.js), [`runJsTask`](./quench/runJsTask.js), [`runCopyTask`](./quench/runCopyTask.js) and more. See [`build.js`](./tasks/build.js) for example usage and `run*Task.js` for documentation on each task.

Nothing in the `/quench` folder should be modified. If there is a new feature or a bug fix, it should happen upstream in https://github.com/Velir/frontend-starter.

### The `/tasks` folder

This is where all the tasks needed for this particular project are defined. [`build.js`](./tasks/build.js) is an example, so this should be updated or replaced to suit this project's needs.

In general, you'll want a separate file for each discrete build tasks (but feel free to create helper files if needed). These files should export factory functions that will usually take the `projectRoot` as an argument, create multiple sub tasks (usually using the `run*Task.js` from quench), and _compose_ them together with [`gulp.series`](https://gulpjs.com/docs/en/api/series) and/or [`gulp.parallel`](https://gulpjs.com/docs/en/api/parallel). See [`build.js`](./tasks/build.js) for examples and read gulp's [documentation](https://gulpjs.com/docs/en/getting-started/creating-tasks#compose-tasks) on composing tasks.

You will then use this factory function in `gulpfile.js` to [expose](https://gulpjs.com/docs/en/getting-started/creating-tasks) it to the gulp command line. Be sure to add helpful description text that describes what the task does:

```javascript
const createBuildTask = require("./tasks/build.js");

const build = createBuildTask(projectRoot);
build.description = "Build frontend assets";
exports.build = build;
```

Now, we can run `gulp build` from command line to execute this task.

A reason to use a factory function is that we can very easily add parameters to make this function more powerful and flexible. For example, in `build.js`, instead of hardcoding the `buildDir`, we could accept it as an argument. This way, we could reuse this task for two different build targets, for example:

```javascript
exports.sitecore = createBuildTask({
  projectRoot,
  buildDir: "path/to/sitecore/"
});

exports.patternlab = createBuildTask({
  projectRoot,
  buildDir: "path/to/patternlab/"
});
```

### Other quench functions

We've already seen `quench.isWatching()`, `quench.setDefaults()`, `quench.maybeWatch()`, `quench.getEnv()`, and `quench.loadLocalJs()` above. Here are some other functions are helpful when creating custom tasks.

See [`quench.js`](./quench/quench.js) for more details about these functions.

#### `quench.resolvePath()`

There is a bug in windows where watchers do not work if the paths use `\\` instead of `/`. Node's [path](https://nodejs.org/docs/latest/api/path.html) functions return `\\`, so use `quench.resolvePath()` instead of `path.resolve()`. For example, in `build.js`:

```javascript
const projectRoot = quench.resolvePath(__dirname, "..");
```

For reference, these are the issues:

- https://github.com/paulmillr/chokidar/issues/668#issuecomment-357235531
- https://github.com/paulmillr/chokidar/issues/777#issuecomment-440119621

#### `quench.logHelp()`

A helper function that logs out all available gulp tasks and other help information to the console. This should be attached to the default task in `gulpfile.js`:

```javascript
exports.default = quench.logHelp;
```

#### `quench.drano()`

A pre-configured version of [`gulp-plumber`](https://github.com/floatdrop/gulp-plumber). Use this immediately after `gulp.src` to nicely handle errors.

```javascript
return gulp
  .src(src)
  .pipe(quench.drano())
  .pipe(/* other plugins */);
```

#### `quench.logYellow()`

This will log the output with the first arg as yellow
eg. `logYellow("watching", "css:", files)` >> `[watching] css: ["some", "files"]` where _[watching]_ is yellow. This is useful for reporting things to the user in the terminal.

#### `quench.logError()`

Will log the arguments to the console in red prefixed with _[error]_. Execution of the task will continue.

#### `quench.throwError()`

Will log the arguments to the console in red prefixed with _[error]_ along with a stack trace. This will also stop the task execution.
