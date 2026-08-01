/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig( {
  root: __dirname,
  plugins: [
    nxViteTsPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [ 'src/**/*.spec.ts' ],
    reporters: [ 'default' ],
    passWithNoTests: true,
  },
} )
