const config = require("./tsconfig.json");
require("ts-node").register({
  ...config,
  compilerOptions: {
    ...config.compilerOptions,
    module: "commonjs",
  },
});

// There are no plans to add support for next.config.ts natively
// https://github.com/vercel/next.js/issues/5318

module.exports = require("./next.config.ts").default;
