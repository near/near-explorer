const babelJest = require("babel-jest");
const fs = require("fs");

const babelRc = JSON.parse(fs.readFileSync("./.babelrc", "utf-8"));

const transformer = babelJest.default.createTransformer(babelRc);

module.exports = transformer;
