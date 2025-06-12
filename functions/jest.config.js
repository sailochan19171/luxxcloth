module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '\.(css|scss|sass)$': 'identity-obj-proxy', // "less" removed for now
    // Example alias, adjust if your project uses them, e.g., from tsconfig.json paths
    // '^@/(.*)$': '<rootDir>/src/',
  },
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Or tsconfig.jest.json if you create one
    }],
  },
  // Ignore tests in functions directory for this config, as it has its own
  testPathIgnorePatterns: ['/node_modules/', '/functions/'],
};
