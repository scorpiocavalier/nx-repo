import { writeFileSync } from 'fs';
import { resolve } from 'path';

const packageJson = {
  name: '@workspace/shared/ui',
  version: '0.0.1',
  main: './index.mjs',
  module: './index.mjs',
  typings: './index.d.ts',
  type: 'module',
  exports: {
    '.': {
      import: './index.mjs',
      types: './index.d.ts',
    },
  },
  peerDependencies: {
    '@angular/common': '>=18.0.0',
    '@angular/core': '>=18.0.0',
  },
};

const outputPath = resolve(process.cwd(), 'dist/libs/shared/ui/package.json');
writeFileSync(outputPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Generated package.json at', outputPath);
