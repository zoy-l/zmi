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
  },
  metas: [
    {
      name: 'keywords',
      content: 'zmi, zmi-cli'
    }
  ],

  scripts: [`console(111);`, { src: `https://a.com/b.js`, defer: true }],
  styles: [`body { color: red; }`, `https://a.com/b.css`]
})
