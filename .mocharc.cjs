'use strict';

module.exports = {
  diff: true,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-files': ['js/test/**/*.js'],
  'watch-ignore': ['node_modules'],
  spec: 'js/test/**/*.js'
};