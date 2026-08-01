/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { resolve } from 'path'

export default defineConfig( ( { mode } ) => ( {
  root: __dirname,
  plugins: [
    nxViteTsPaths(),
  ],
  build: {
    target: 'es2022',
    outDir: '../../../dist/libs/shared/ui',
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: resolve( __dirname, 'src/index.ts' ),
      formats: [ 'es' ],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        /^@angular\//,
        'rxjs',
        /^rxjs\//,
        'tslib',
        'zone.js',
      ],
    },
  },
} ) )
