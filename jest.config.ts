import type { Config } from 'jest'

export default {
  testEnvironment: 'miniflare',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
} satisfies Config
