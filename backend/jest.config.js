export default {
  testEnvironment: "node",
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ["**/__tests__/**/*.test.js", "**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: false,
};


