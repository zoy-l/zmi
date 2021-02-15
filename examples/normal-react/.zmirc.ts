import { defineConfig } from 'zmi'

export default defineConfig({
  frameOptions: {},
  chainWebpack: function (config) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'nodeModules',
              priority: -10,
              reuseExistingChunk: true
            }
          }
        }
      }
    })
  }
})
