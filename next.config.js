// next.config.js
const withCSS = require("@zeit/next-css");
const withTypescript = require("@zeit/next-typescript");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = withTypescript(
  withCSS({
    webpack(config, options) {
      // Do not run type checking twice:
      if (options.isServer)
        config.plugins.push(new ForkTsCheckerWebpackPlugin());

      return config;
    }
  })
);
