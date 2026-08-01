/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig( ( { mode } ) => ( {
  root: __dirname,
  plugins: [ nxViteTsPaths() ],
  build: {
    target: 'es2022',
    outDir: '../../dist/apps/ecommerce',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    hmr: true,
  },
  resolve: {
    mainFields: [ 'module', 'main' ],
  },
} ) )
