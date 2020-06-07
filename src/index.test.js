import * as babel from "@babel/core";
import plugin from "./index.mjs";

describe("Plugin tests", () => {
  test("Built-in module extension is not changed when no options are given", () => {
    const input = 'import fs from "fs";';
    const { code } = babel.transform(input, { presets: [["@babel/env"]], plugins: [plugin] });

    expect(code).toContain('require("fs")');
  });

  test("Built-in module extension is not changed when an option is given", () => {
    const input = 'import fs from "fs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo" }]],
    });

    expect(code).toContain('require("fs")');
  });

  test("Built-in module extension is not changed when options are given", () => {
    const input = 'import fs from "fs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo", foo: "bar" }]],
    });

    expect(code).toContain('require("fs")');
  });

  test("node_modules module extension is not changed when no options are given", () => {
    const input = 'import foo from "module.mjs";';
    const { code } = babel.transform(input, { presets: [["@babel/env"]], plugins: [plugin] });

    expect(code).toContain('require("module.mjs")');
  });

  test("node_modules module extension is not changed when an option is given", () => {
    const input = 'import foo from "module.mjs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo" }]],
    });

    expect(code).toContain('require("module.mjs")');
  });

  test("node_modules module extension is not changed when multiple options are given", () => {
    const input = 'import foo from "module.mjs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo", foo: "bar" }]],
    });

    expect(code).toContain('require("module.mjs")');
  });

  test("Module extension is changed when no options are given", () => {
    const input = 'import foo from "./module.mjs";';
    const { code } = babel.transform(input, { presets: [["@babel/env"]], plugins: [plugin] });

    expect(code).toContain('require("./module.js")');
  });

  test("Module extension is changed when an option is given", () => {
    const input = 'import foo from "./module.mjs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo" }]],
    });

    expect(code).toContain('require("./module.foo")');
  });

  test("Module extension is changed when multiple options are given", () => {
    const input = 'import foo from "./module.mjs";';
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo", foo: "bar" }]],
    });

    expect(code).toContain('require("./module.bar")');
  });

  test("Built-in, node_modules and regular modules are handled correctly when mixed", () => {
    const input = `
      import fs from "fs";
      import foo from "module.mjs";
      import bar from "./module.mjs";
    `;
    const { code } = babel.transform(input, {
      presets: [["@babel/env"]],
      plugins: [[plugin, { mjs: "foo", foo: "bar" }]],
    });

    expect(code).toContain('require("fs")');
    expect(code).toContain('require("module.mjs")');
    expect(code).toContain('require("./module.bar")');
  });
});
