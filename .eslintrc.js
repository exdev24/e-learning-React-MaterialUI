const fs = require('fs');
const path = require('path');
const { print } = require('graphql/language/printer');
const gql = require('graphql-tag');

const typeDefsFile = path.join(__dirname, 'api.graphql');
const typeDefs = gql(fs.readFileSync(typeDefsFile, 'utf8'));

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true
  },
  plugins: ['graphql'],
  env: {
    es6: true,
    node: true,
    browser: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-console': 'error',
    'prettier/prettier': ['error', require('./.prettierrc')],
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaString: print(typeDefs)
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier/@typescript-eslint'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    },
    {
      files: ['*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier/react'
      ],
      rules: {
        'react/prop-types': 'off'
      }
    }
  ]
};
