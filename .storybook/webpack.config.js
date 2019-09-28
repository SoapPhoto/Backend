const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const path = require('path');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: true,
    },
  });
  config.module.rules.push(
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: require.resolve('graphql-tag/loader'),
    });

  config.resolve.extensions.push(".ts", ".tsx");

  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      async: false,
      checkSyntacticErrors: true,
      formatter: require("react-dev-utils/typescriptFormatter"),
    })
  );
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
};
