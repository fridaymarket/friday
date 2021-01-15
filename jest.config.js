
module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    '<rootDir>/packages/friday-async/**/*.{ts,tsx}',
    '<rootDir>/packages/friday-core/**/*.{ts,tsx}',
    '<rootDir>/packages/friday-components/**/*.{ts,tsx}',
    '!<rootDir>/packages/friday-components/**/*.stories.{ts,tsx}',
    '!<rootDir>/packages/friday-components/**/stories/**/*',
    '!<rootDir>/packages/**/lib/**/*',
    '!<rootDir>/packages/**/*.d.ts',
    '!<rootDir>/packages/friday-async/src/axios/httpAxios.ts',
    '!<rootDir>/packages/friday-async/src/useRequest/useRequest.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    }
  },
  transform: {
    "\\.(ts)x?$": "ts-jest",
    "\\.(svg|js)x?$": "ts-jest",
    '\\.(less)$': '<rootDir>/jest.transformer.js'
  },
  testMatch: [
    "<rootDir>/packages/**/?(*.)+(test).ts?(x)"
  ],
  setupFiles: [
    "./setupTests.js"
  ]
};