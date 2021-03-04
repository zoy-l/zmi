export default {
  chainWebpack: (webpackConfig) => {
    webpackConfig.entry('test').add('./foo.js')
    webpackConfig.entry('bar').merge(['./bar.js'])
    webpackConfig.entry('arr').merge(['./bar.js', './foo.js'])
  },
  frameType: 'react',
  cache: 'filesystem'
}
