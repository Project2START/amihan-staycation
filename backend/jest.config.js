/**
 * Jest configuration to ensure the test setup file runs and TypeScript tests
 * are handled by ts-jest.
 */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
};
