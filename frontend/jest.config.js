module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js", "jest-date-mock"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  transform: {
    "^.+\\.([jt]sx?)$": "babel-jest"
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverage: false
};
