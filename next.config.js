const withTypescript = require('@zeit/next-typescript');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withTypescript({
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en)/)
    )

    // config.resolve = {
    //   ...config.resolve,
    //   ...{
    //     alias: {
    //       ...config.resolve.alias,
    //       '@src': path.resolve(__dirname, 'client'),
    //     }
    //   },
    // };

    return config
  }
});
