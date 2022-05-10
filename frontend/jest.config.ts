import nextJest from "next/jest";
import * as path from "path";

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testRegex: "(\\.|/)test\\.[jt]sx?$",
  testEnvironment: "<rootDir>/src/testing/env.ts",
  collectCoverage: false,
  timers: "modern",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": path.join(__dirname, "./babel-jest-wrapper"),
  },
});
