import nextJest from "next/jest";
import * as path from "path";
import { pathsToModuleNameMapper } from "ts-jest";
// eslint-disable-next-line import/no-extraneous-dependencies
import tsConfig from "tsconfig.json";

const createJestConfig = nextJest({
  dir: "./",
});

export default createJestConfig({
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testRegex: "(\\.|/)test\\.[jt]sx?$",
  testPathIgnorePatterns: ["/node_modules/", "./utils/"],
  testEnvironment: "<rootDir>/src/testing/env.ts",
  collectCoverage: false,
  timers: "modern",
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": path.join(__dirname, "./babel-jest-wrapper"),
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: `<rootDir>/../${tsConfig.compilerOptions.baseUrl}/`,
    }),
    "^.+\\.(svg)$": "<rootDir>/src/testing/svg-mock.ts",
  },
});
