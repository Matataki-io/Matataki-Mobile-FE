const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')
const WebpackBar = require('webpackbar')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const WebpackMonitor = require('webpack-monitor')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 1. 开发分支
// 2. 测试环境分支 目前三个分支所以 测试分支配置同步生产环境
// 3. 生产环境分支

// ----

// todo
// 1、把打包生成的 runtime.js 还没有写入到html里面(因为一直报错....)
// 2、....
// ----

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development'
// 显示捆绑分析
const showBundleAnalyzer = false
// 显示打包的速度
const showSpeedMeasurePlugin = false
// 关闭eslint 因为还没有做GitHub或者提交时的检测
// process.env.NODE_ENV !== 'production',
const offEslint = false
const showMonitor = false
console.log(process.env.NODE_ENV)

// configureWebpack config
const configureWebpack = () => {
  let configExternals = Object.create(null)
  let configPluginsModules = []
  let pluginsConfig = []
  showMonitor && pluginsConfig.push(new WebpackMonitor({
    capture: true, // -> default 'true'
    target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
    launch: true, // -> default 'false'
    port: 3030, // default -> 8081
    excludeSourceMaps: true // default 'true'
  }))

  // 是否显示捆绑包分析页面
  showBundleAnalyzer && pluginsConfig.push(new BundleAnalyzerPlugin())
  // 插件配置
  let minimizer = []

  if (isDev) {
    pluginsConfig.push(
        // vConsole 觉得碍眼可以自行注释
      new vConsolePlugin({
        filter: [],  // 需要过滤的入口文件
        enable: true // 发布代码前记得改回 false
      }),
    )
  } else {
    // 抽离
    configExternals = {
      'axios': 'axios',
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'moment': 'moment',
      'element-ui': 'ELEMENT',
      'vant': 'vant',
      'iview': 'iview',
      'html2canvas': 'html2canvas',
    }
    // cdn
    configPluginsModules = [
      {
        name: 'axios',
        var: 'axios',
        path: 'dist/axios.min.js'
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
        name: 'moment',
        paths: ['min/moment.min.js', 'locale/zh-cn.js']
      },
      {
        name: 'element-ui',
        var: 'ELEMENT',
        path: 'lib/index.js',
        style: 'lib/theme-chalk/index.css'
      },
      {
        name: 'vant',
        path: 'lib/vant.min.js'
      },
      {
        name: 'iview',
        path: 'dist/iview.min.js'
      },
      {
        name: 'html2canvas',
        path: 'dist/html2canvas.min.js'
      },
    ]
    minimizer = [
      // minify your JavaScript.
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        }
      })
    ]

    // 生产环境的插件配置
    pluginsConfig.push(
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
      // gzip
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      })
    )
  }
  return {
    externals: configExternals,
    optimization : {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          commons: {
            name: 'chunk-comomns',
            test: resolve('src/components/baseComponents'),
            minChunks: 2, // 最小共用次数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: {
        name: 'runtimeChunk'
      },
      minimize: !isDev,
      minimizer: minimizer
    },
    plugins: [
      new WebpackBar({
        name: 'client',
        profile: false
      }),
      new WebpackCdnPlugin({
        modules: configPluginsModules,
        publicPath: '/node_modules',
        crossOrigin: true
      }),
      ...pluginsConfig
    ]
  }
}
module.exports = {
  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint
  lintOnSave: !offEslint,
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
  configureWebpack: showSpeedMeasurePlugin ? smp.wrap(configureWebpack()) : configureWebpack(),
  css: {
    extract: true,
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
  // devServer: {
  //   proxy: {
  //     '/': {
  //       target: 'https://apitest.smartsignature.io'
  //       // target: 'http://127.0.0.1:7001'
  //     }
  //   }
  // },
  productionSourceMap: isDev,
  parallel: true,

  // 全局less变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/global.less')]
    }
  }
}