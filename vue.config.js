// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

const WebpackCdnPlugin = require('webpack-cdn-plugin')
const path = require('path')

const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 动态计算环境变量并以 `process.env.` 注入网站
// trick from: https://cli.vuejs.org/zh/guide/mode-and-env.html#在客户端侧代码中使用环境变量
process.env.VUE_APP_VERSION = require('./package.json').version

process.env.VUE_APP_COMMIT_HASH = process.env.COMMIT_REF
// console.log(process.env.NODE_ENV);
const { NODE_ENV } = process.env
// console.debug(process.env.VUE_APP_SIGNATURE_CONTRACT);

module.exports = {
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

    if (NODE_ENV === 'test') {
      config.merge({
        target: 'node',
        devtool: 'inline-cheap-module-source-map',
        externals: [
          {
            canvas: 'commonjs canvas'
          },
          'bufferutil',
          'utf-8-validate'
        ]
      })
      // when target === 'node', vue-loader will attempt to generate
      // SSR-optimized code. We need to turn that off here.
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.optimizeSSR = false
          return options
        })
    }
  },

  configureWebpack: config => {
    let configExternals = [
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

    let configPluginsModules = [
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
    // todo 后面区分三个端的环境
    if (NODE_ENV === 'development') {
      console.log('development')
    } else {
      console.log('prod')
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
      // 图片优化
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif)$/i,
        plugins: [
          imageminMozjpeg({
            disable: process.env.NODE_ENV !== 'production',
            quality: '65-80',
            progressive: true
          })
        ]
      }),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true
      })
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

  // productionSourceMap: NODE_ENV === 'development' // 去掉map文件
  // 去掉map文件
  // 代理
  // devServer: {
  //   proxy: {
  //     '/': {
  //       target: 'https://apitest.smartsignature.io'
  //     }
  //   }
  // }
  productionSourceMap: false,

  // 全局less变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/global.less')]
    }
  }
}
