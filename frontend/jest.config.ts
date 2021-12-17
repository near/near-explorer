import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testRegex: "(\\.|/)test\\.[jt]sx?$",
  testEnvironment: "jsdom",
  collectCoverage: false,
  timers: "modern",
});
