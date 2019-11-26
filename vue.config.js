// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// TODO:
// 1. 开发分支
// 2. 测试环境分支 目前三个分支所以 测试分支配置同步生产环境
// 3. 生产环境分支

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },

  configureWebpack: config => {
    let configExternals = []
    let configPluginsModules = []
    let prodPlugins = []
    if (isDev) {
      console.log(process.env.NODE_ENV)
    } else {
      // 抽离
      configExternals = [
        'axios',
        {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          vuex: 'Vuex',
          'element-ui': 'ELEMENT',
          'mavon-editor': 'MavonEditor'
          // eosjs: 'Eos'
        },
        'moment',
        'encoding',
        'bufferutil',
        'memcpy',
        'utf-8-validate'
      ]
      // cdn
      configPluginsModules = [
        {
          name: 'axios',
          var: 'axios',
          path: 'dist/axios.min.js'
        },
        {
          name: 'moment',
          paths: ['min/moment.min.js', 'locale/zh-cn.js']
        },
        {
          name: 'vue',
          var: 'Vue',
          path: 'dist/vue.runtime.min.js'
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'dist/vue-router.min.js'
        },
        {
          name: 'vuex',
          var: 'Vuex',
          path: 'dist/vuex.min.js'
        },
        {
          name: 'element-ui',
          var: 'ELEMENT',
          path: 'lib/index.js',
          style: 'lib/theme-chalk/index.css'
        },
        {
          name: 'mavon-editor',
          var: 'mavonEditor',
          cssOnly: true,
          style: 'dist/css/index.css'
        },
        {
          name: 'mavon-editor',
          var: 'mavonEditor',
          prodUrl:
            'https://cdn.jsdelivr.net/gh/zhaokuohaha/mavonEditor@feature/lib-name/dist/mavon-editor.js'
        }
        /* {
          name: 'eosjs',
          var: 'Eos',
        }, */
      ]
      // 生产环境的插件配置
      prodPlugins = [
        // 图片优化
        new ImageminPlugin({
          test: /\.(jpe?g|png|gif)$/i,
          plugins: [
            imageminMozjpeg({
              // disable: process.env.NODE_ENV !== 'production',
              quality: '65-80',
              progressive: true
            })
          ]
        }),
        // minify your JavaScript.
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: { drop_console: true }
          }
        }),
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css)$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true
        })
      ]
      console.log(process.env.NODE_ENV)
    }
    config.optimization = {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
    config.externals = configExternals
    config.plugins.push(
      new WebpackCdnPlugin({
        modules: configPluginsModules,
        publicPath: '/node_modules',
        crossOrigin: true
      }),
      ...prodPlugins
    )
  },

  css: {
    extract: true, // 是否使用css分离插件
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  },

  pwa: {
    msTileColor: '#542de0',
    themeColor: '#FFF',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    },
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },

  // 代理 只修改了.env.development VUE_APP_API
  devServer: {
    proxy: {
      '/': {
        target: 'https://apitest.smartsignature.io'
      }
    }
  },
  productionSourceMap: isDev,

  // 全局less变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/global.less')]
    }
  }
}
