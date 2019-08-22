require('dotenv').config();

const composePlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withOffline = require('next-offline');

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');


const nextConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: './bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: './bundles/client.html',
    },
  },
  useFileSystemPublicRoutes: false,
  webpack(config) {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(zh-cn)/),
    );
    // config.plugins.push(
    //   new SWPrecacheWebpackPlugin({
    //     navigateFallback: '/index',
    //     minify: true,
    //     staticFileGlobsIgnorePatterns: [/\.next\//],
    //     staticFileGlobs: [
    //       '.next/bundles/**/*.{js,json}',
    //       '.next/static/**/*.{js,css,jpg,jpeg,png,svg,gif}'
    //     ],
    //     staticFileGlobsIgnorePatterns: [/_.*\.js$/, /\.map/],
    //     runtimeCaching: [
    //       { handler: 'fastest', urlPattern: /[.](jpe?g|png|svg|gif)/ },
    //       { handler: 'networkFirst', urlPattern: /^https.*(js|css)/ }
    //     ],
    //   })
    // )

    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    );

    config.resolve = {
      ...config.resolve,
      ...{
        alias: {
          ...config.resolve.alias,
          '@lib': path.resolve(__dirname, 'lib'),
          '@common': path.resolve(__dirname, 'common'),
          '@pages': path.resolve(__dirname, 'pages'),
        },
      },
    };
    return config;
  },
};

module.exports = composePlugins(
  [withOffline, withBundleAnalyzer],
  nextConfig,
);
