// next.config.js
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  webpack(config, options) {
    return config;
  }
});
