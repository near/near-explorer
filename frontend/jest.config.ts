import nextJest from "next/jest";

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
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
});
