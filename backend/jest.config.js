/**
 * Jest configuration to ensure the test setup file runs and TypeScript tests
 * are handled by ts-jest.
 */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
};
