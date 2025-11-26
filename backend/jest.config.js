export default {
  testEnvironment: "node",
  transform: {},

  // Load environment variables from test.env
  setupFiles: ["dotenv/config"],

  // Setup DB/Test Lifecycle
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"]
};
