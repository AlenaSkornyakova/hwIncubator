const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} **/
module.exports = {
  setupFiles: ['<rootDir>/__tests__/jest.env.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
  testEnvironment: 'node',
  testTimeout: 100000,
  testRegex: '.e2e.test.ts$',
  transform: {
    ...tsJestTransformCfg,
  },
};
