require('dotenv').config()

const composePlugins = require('next-compose-plugins')
const withTypescript = require('@zeit/next-typescript');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withOffline = require('next-offline')

const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack')
const path = require('path');


const nextConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: './bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: './bundles/client.html'
    }
  },
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en)/)
    )
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
        systemvars: true
      })
    )
  
    config.resolve = {
      ...config.resolve,
      ...{
        alias: {
          ...config.resolve.alias,
          '@pages': path.resolve(__dirname, 'pages'),
        }
      },
    };

    return config
  }
}


module.exports = composePlugins(
  [withOffline, withBundleAnalyzer],
  nextConfig
)
