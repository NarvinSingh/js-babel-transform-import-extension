const defaultOpts = { mjs: "js" };

export default function plugin() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { source } = path.node;
        const { value } = source;
        const { opts } = state;
        let origExts = Object.keys(opts);
        const newExtFrom = origExts.length ? opts : defaultOpts;

        origExts = Object.keys(newExtFrom);
        source.value = origExts.reduce(
          (newValue, origExt) =>
            newValue.replace(new RegExp(`^(\\..*\\.)${origExt}$`), `$1${newExtFrom[origExt]}`),
          value
        );
      },
    },
  };
}
