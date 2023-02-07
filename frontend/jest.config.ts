import nextJest from "next/jest";
import { pathsToModuleNameMapper } from "ts-jest";
import * as path from "path";

import tsConfig from "../tsconfig.json";

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
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: `<rootDir>/../${tsConfig.compilerOptions.baseUrl}/`,
  }),
});
