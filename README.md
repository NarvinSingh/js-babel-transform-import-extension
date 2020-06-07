# Babel Plugin to Transform Import File Extensions

When transpiling ES modules with `import` statements to CommonJS modules with `require` calls, if
you import other ES modules with the `.mjs` file extension, the resulting `require` calls will fail
because all the transpiled `.mjs` files now have `.js` extensions, but the `require` calls still
refer to the `.mjs` extension. This plugin will fix the `require` calls.

## Installation

```Shell
> npm i -D babel-plugin-transform-import-extension
```

## Usage

This plugin is meant to be used in a workflow where you write modern JavaScript using ES modules and
want to be able to run your original code, as well as your transpiled code.

Since Node.js interprets files with the `.mjs` extension as ES modules and files with the `.js` as
CommonJS modules, we have to use the `.mjs` extension if we want to run our original code. While we
could include `"type": "module"` in `package.json` to make Node treat all files as ES modules and
use only the `.js` extension, we wouldn't be able to run our transpiled code because `require` won't
be defined in this case. We can't omit the file extension altogher in the import statement either,
because Node doesn't infer file extensions for modules that are not built-in or installed (in the
`node_modules` directory). This plugin helps you get around these issues.

Include the plugin in your `.baberc` file. The default mapping is to convert `.mjs` to `.js`.

```JSON
{
  "presets": [["@babel/env"]],
  "plugins": ["transform-import-extension"]
}
```

Then you can write some ES module, `module.mjs`, then import it in another ES module like this:

```JavaScript
import foo from "./module.mjs";
```

The `import` code would normally be transpiled to something like this:

```JavaScript
"use strict";

var _module = _interopRequireDefault(require("./module.mjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
```

However, there is no `./module.mjs` because it was renamed to `./module.js` when it was transpiled.
This plugin will cause the `require` call to be transpiled as this instead:

```JavaScript
var _module = _interopRequireDefault(require("./module.js"));
```

You may also supply your own custom mappings in `.babelrc`. In this example,

- import statments of `.mjs` files will be transpiled to `require` calls of `.js` files
- import statments of `.foo` files will be transpiled to `require` calls of `.bar` files

```JSON
{
  "plugins": [
    [
      "transform-import-extension",
      {
        "mjs": "js",
        "foo": "bar"
      }
    ]
  ]
}
```

### Jest

This plugin does not work with Jest when using babel-jest to transpile the files because Jest
_expects_ the original file extension. To account for this, you can leverage the fact that Jest will
run in the `test` environment and setup your `.babelrc` to have the plugin do nothing in that case.
In this example,

- The plugin will run in all environments with default options, except for the `test` environment
- The plugin will be effectively disabled in the `test` environment because it will not change any
  file extensions

```JSON
{
  "presets": [["@babel/env"]],
  "plugins": ["transform-import-extension"],
  "env": {
    "test": {
      "plugins": [["transform-import-extension", { "mjs": "mjs" }]]
    }
  }
}
```
