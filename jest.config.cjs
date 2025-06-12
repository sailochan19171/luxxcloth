module.exports = {
  rootDir: '.', // Explicitly set rootDir to the current directory (project root)
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Changed path
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // "less" removed for safety with tool
    // Example alias for absolute paths if used in tsconfig.json
    // '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json', // Point to app's tsconfig
    }],
  },
  // Ignore tests in the functions directory, as it has its own Jest setup
  testPathIgnorePatterns: ['/node_modules/', '/functions/'],
};
