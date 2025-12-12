const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: 'node',
  testTimeout: 100000,
  testRegex: '.e2e.test.ts$',
  transform: {
    ...tsJestTransformCfg,
  },
};
