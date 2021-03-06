'use strict'
const utils = require('./utils')
const fs = require('fs')
const _ = require('lodash')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: 6 })
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
<<<<<<< HEAD
// const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
=======
const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')

>>>>>>> 2c28649ccbbfda60190b34ce1bb529bf696eff38
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const { version } = require('./../package.json')

function getDLLFileName() {
  const fileNames = fs.readdirSync(path.resolve(__dirname, '../static/dll/'))

  return _.find(fileNames, fileName => fileName.endsWith(`${version}.js`))
}
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function customPath () {
  return path.join(__dirname, 'shell.html')
}
const pluginDefaultConfig = {
  text: {
    color: '#EEEEEE'
  },
  image: {
    shape: 'rect', // `rect` | `circle`
    color: '#EFEFEF',
    shapeOpposite: []
  },
  button: {
    color: '#EFEFEF',
    excludes: [] 
  },
  svg: {
    color: '#EFEFEF',
    shape: 'circle', // circle | rect
    shapeOpposite: []
  },
  pseudo: {
    color: '#EFEFEF', // or transparent
    shape: 'circle' // circle | rect
  },
  device: 'iPhone 6 Plus',
  debug: false,
  minify: {
    minifyCSS: { level: 2 },
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: false
  },
  defer: 5000,
  excludes: [],
  remove: [],
  hide: [],
  grayBlock: [],
  cookies: [],
  headless: true,
  h5Only: false
}

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: Object.assign(
      utils.styleLoaders(
        { sourceMap: config.dev.cssSourceMap, usePostCSS: true },
        {
          test: /\.js$/,
          use: 'happypack/loader?id=js', // 指定loader
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        }
      )
    )
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.optimize.ModuleConcatenationPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new webpack.DllReferencePlugin({
      context: __dirname,
      // 在这里引入 manifest 文件
      manifest: require('../static/dll/vue.manifest.json')
    }),
    // 把js插入到html文件中
    new AddAssetHtmlPlugin({
      filepath: require.resolve(`../static/dll/${getDLLFileName()}`),
      outputPath: 'dll',
      includeSourcemap: false,
      hash: true,
      publicPath: '/static/dll/'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
<<<<<<< HEAD
    // new SkeletonPlugin({
    //   pathname: path.resolve(__dirname, 'Skeleton.vue'), // the path to store shell file
    //   staticDir: path.resolve(__dirname, './src'), // the same as the `output.path`
    //   routes: ['/','/recommend'] // Which routes you want to generate skeleton screen
    // }),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [
        {
          path: 'babel-loader',
          query: {
            cacheDirectory: true
          }
        }
      ]
=======

    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [{
          path: 'babel-loader',
          query: {
              cacheDirectory: true
          }
      }]
    }),
    new SkeletonPlugin({
      pathname: path.resolve(__dirname, `${customPath}`) // 生成名为 shell 文件存放地址
>>>>>>> 2c28649ccbbfda60190b34ce1bb529bf696eff38
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
