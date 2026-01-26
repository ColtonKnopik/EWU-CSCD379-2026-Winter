import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,

    // Optional: if you use `vitest --typecheck`, this tells it which tsconfig to use
    typecheck: {
      tsconfig: 'tests/tsconfig.json',
    },
  },
})
