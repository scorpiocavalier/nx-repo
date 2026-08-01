import nx from '@nx/eslint-plugin'

export default [
  ...nx.configs[ 'flat/base' ],
  ...nx.configs[ 'flat/typescript' ],
  ...nx.configs[ 'flat/javascript' ],
  {
    files: [ '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx' ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [ 'type:lib' ],
            },
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: [ 'type:lib' ],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: [ 'scope:shared' ],
            },
          ],
        },
      ],
    },
  },
]
