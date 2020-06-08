# Babel Plugin to Transform Import File Extensions

When ES modules are transpiled to CommonJS modules, two things that happen are that:

1. `import` statements are converted to `require` calls
2. modules with `mjs` file extensions become `js` files in the output directory

However, the paths in the `import` statments are _not_ changed in the `require` calls. So if you
were importing any of these modules using a relative path and specifying the `mjs` extension,
`require` will not be able to find them in the output directory. This plugin will rewrite the path
in the `require` calls to have the `js` extension.

## Installation

```Shell
> npm i -D babel-plugin-transform-import-extension
```

## Usage

Use this plugin in a workflow where you write modern JavaScript using ES modules and can run your
original code, as well as your transpiled code.

There are two ways to tell Node.js to treat files as ES modules:

1. treat all files as ES modules by including `"type": "module"` in `package.json`
2. treat individual files as ES modules by giving them the `mjs` extension

If we went with the first option, we could give all of our files `js` extensions. However, we won't
be able to run our transpiled code from within our package because those files will be considered ES
modules and `require` will be `undefined`.

We've already discussed why the second option doesn't work.

Omitting the file extension entirely in the `import` statement to have Node resolve the file for us
won't work either, because Node does not resolve `mjs` files if they are not installed (in the
`node_modules` directory).

So we have to resort to a plugin if we want to run both versions of our code from within their own
package.

Include the plugin in your `.baberc` file.

```JSON
{
  "presets": [["@babel/env"]],
  "plugins": ["transform-import-extension"]
}
```

Now you can write some ES module, `module.mjs`, then import it in another ES module:

```JavaScript
import foo from "./module.mjs";
```

That `import` statement may normally be transpiled to something like this:

```JavaScript
var _module = _interopRequireDefault(require("./module.mjs"));
```

However, there is no `./module.mjs` in the output directory because it was renamed to `./module.js`.
This plugin will cause that `require` call to be transpiled to this instead:

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

Only import statements with local relative paths will have their extensions rewritten. So, none of
these `import` statments will have their paths rewritten:

```JavaScript
import fs from "fs";  // built-in module
import express from 'express'; // installed module
import foo from "./module"; // relative path module without a file extension
import bar from "/module.mjs"; // absolute path module
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
