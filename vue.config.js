const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/style/index.scss";
        `
      }
    }
  },
  productionSourceMap: process.env.NODE_ENV === 'development',
  // 打包production清除console
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: process.env.NODE_ENV === 'production'
            }
          }
        })
      ]
    },
    // xlsx-style問題
    // https://segmentfault.com/q/1010000041737065
    resolve: {
      fallback: {
        fs: false
      },
      // vue-i18n問題
      // https://segmentfault.com/a/1190000042062141
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    externals: {
      './cptable': 'var cptable'
    }
  }
})
