export default {
  testEnvironment: "node",

  // roda TS com ESM
  preset: "ts-jest/presets/default-esm",

  // trata .ts como ESM
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // isso resolve imports com ".js" vindo do TS (tipo "../../../src/.../Foo.js")
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/tests/**/*.test.ts"],
};
