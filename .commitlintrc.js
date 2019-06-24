module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'config',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'temp',
        'test',
      ]
    ],
    'subject-case': [0, 'never', ['lower-case']]
  }
}
