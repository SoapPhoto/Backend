const path = require('path');

module.exports = {
  stories: ['../lib/**/*.stories.tsx'],
  addons: [
    'storybook-addon-styled-component-theme/dist/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-viewport/register'
    // '@storybook/addon-notes/register',
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: true,
        presets: [['react-app', { flow: false, typescript: true }]],
      },
    });
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: require.resolve('graphql-tag/loader'),
    });
    config.resolve = {
      ...config.resolve,
      ...{
        alias: {
          ...config.resolve.alias,
          '@lib': path.resolve(__dirname, '../lib'),
          '@common': path.resolve(__dirname, '../common'),
        },
      },
    };
    return config;
  },
};
