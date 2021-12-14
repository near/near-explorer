const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  setupFiles: ["<rootDir>/jest.setup.js", "jest-date-mock"],
  testRegex: "(\\.|/)test\\.[jt]sx?$",
  testEnvironment: "jsdom",
  collectCoverage: false,
});
