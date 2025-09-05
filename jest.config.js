// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createDefaultPreset } = require( "ts-jest" );

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};