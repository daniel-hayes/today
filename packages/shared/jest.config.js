process.env.TZ = 'GMT';

module.exports = {
  testMatch: ['**/__tests__/**/*.ts'],
  transform: {
    // '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.ts$': 'ts-jest',
  },
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
  collectCoverage: true,
};
