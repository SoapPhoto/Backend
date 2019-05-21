require('dotenv').config()

const withTypescript = require('@zeit/next-typescript');
const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack')

const withOffline = require('next-offline')

module.exports = withOffline(
  withTypescript({
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
  })
)