module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'comma-dangle': ['error', 'always-multiline'], // require trailing commas in multiline objects
    'arrow-parens': ['error', 'always'], // always use parentheses around arrow function parameters
    'no-console': 'warn', // allow console statements but warn
    'no-use-before-define': 'warn', // warn about use before define
    'import/no-unresolved': 'warn', // warn about unresolved imports
    'no-unused-vars': 'warn', // warn about unused variables
    'operator-linebreak': 'off', // disable operator linebreak rules
    'implicit-arrow-linebreak': 'off', // disable implicit arrow linebreak
    'function-paren-newline': 'off', // disable function paren newline
    'object-curly-newline': 'off', // disable object curly newline
    'nonblock-statement-body-position': 'off', // disable nonblock statement body position
    curly: 'off', // disable curly braces requirement
    'no-confusing-arrow': 'off', // disable confusing arrow
    indent: 'off', // disable indent rules
    'no-bitwise': 'off', // disable bitwise operator rules
    'max-len': 'off', // disable max line length
  },
};
