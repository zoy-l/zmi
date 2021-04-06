// when using @zmi/webpack alone
// The logic here is similar to the preset logic, but does not conflict
const configDefault = {
  alias: {},
  autoCSSModules: true,
  define: {},
  devtool: false,
  devServer: {},
  disableESLint: true,
  externals: {},
  extraBabelPlugins: [],
  extraBabelPresets: [],
  extraPostCSSPlugins: [],
  favicon:
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjEyOTY3Mjk2MzAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijc4NjUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTQ1IDM3MS42bDUwLTc2IDU2LTMwIDQ0LTgwIDgyLTI0IDYwLTQ2LjggMTI0LTEwLjcgODggNTEuNSA0OCAxNCA1OCA1NiAyOCA0NiA0NiAyMCA1MCA2MnYzOEgxNDV6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSI3ODY2Ij48L3BhdGg+PHBhdGggZD0iTTM0MiA4MTUuNmgzNjFsMy43IDExOC40SDMxNy4zTDMzMSA4MTUuNnoiIGZpbGw9IiM4MjUyOWQiIHAtaWQ9Ijc4NjciIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkyNSIgY2xhc3M9InNlbGVjdGVkIj48L3BhdGg+PHBhdGggZD0iTTExOS45IDM4My44bDgzMi4xIDcuOS0yNC44IDE0NS45LTU5LjIgMTMyLTY3IDc0LjMtODguMSA3NS43LTM4MS45LTQtMTE4LTcxLjdMOTYuOCA1OTkuNiA3MiAzOTEuOHoiIGZpbGw9IiM4MjUyOWQiIHAtaWQ9Ijc4NjgiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkyNCIgY2xhc3M9InNlbGVjdGVkIj48L3BhdGg+PHBhdGggZD0iTTk2MCA0MTFjMC03LjItMi45LTE0LjEtOC0xOS4ycy0xMi04LTE5LjItOGgtMzEuOWMtNC44LTYzLjItNTEuOC0xMTQuNi0xMTMuMS0xMjUuNC0xMi02NC4yLTY4LjItMTEzLTEzNS44LTExMy0wLjUgMC0xIDAuMy0xLjUgMC4zLTI3LjYtMzgtNzkuNS02My42LTEzOC45LTYzLjYtNTMuNyAwLTEwMy41IDIwLjgtMTMzLjIgNTUuOC0yLjEgMi40LTMuNiA1LjEtNS40IDcuNi02Ny40IDAuMy0xMjMuMyA0OS0xMzUuMiAxMTMtNjEuMSAxMS4xLTEwNy44IDYyLjMtMTEyLjYgMTI1LjRoLTM0Yy03LjIgMC0xNC4xIDIuOS0xOS4yIDgtNC41IDQuNS03LjIgMTAuMy03LjggMTYuNS0wLjEgMC45LTAuMSAxLjgtMC4xIDIuNyAwIDMuNiAwIDcuNiAwLjEgMTEuNyAyLjEgOTMgMzAuNyAzMTUgMjQ2LjIgNDAwLjgtMC4zIDEuNy0xIDMuMy0xIDUuMnY4Ni4xYzAgNy4yIDIuOSAxNC4xIDggMTkuMnMxMiA4IDE5LjIgOGgzNTFjNy4yIDAgMTQuMS0yLjkgMTkuMi04czgtMTIgOC0xOS4ydi04Ni4xYzAtMy4yLTAuOC02LjItMS44LTkuMUM4ODIuMiA3NDUuOSA5NjAgNTc3LjkgOTYwIDQxMXpNMjQzLjcgMjkwLjdsMjIuMy00IDQuMS0yMi4zYzkuMi00OS43IDUyLjYtODYgMTAzLTg2LjJsMTYuNy0wLjEgOS44LTEzLjVjMS0xLjMgMS44LTIuNSAyLjUtMy42IDAuNS0wLjcgMS4xLTEuNyAxLjQtMiAyMy41LTI3LjcgNjMuOS00NC4yIDEwOC4xLTQ0LjIgNDYuOCAwIDg5LjkgMTkuMiAxMTIuNCA1MC4xbDEwLjUgMTQuNSAxNy45LTFjMC44IDAgMS41LTAuMSAyLjItMC4yIDQ5LjUgMS4zIDkxLjcgMzcuMSAxMDAuOCA4Ni4ybDQuMiAyMi4zIDIyLjQgNGM0Ni4yIDguMiA4MS4yIDQ2LjMgODUuOSA5My4xSDE1OC4yYzQuNi00Ni43IDM5LjUtODQuOCA4NS41LTkzLjF6IG00MzguMiA2MTguNUgzNDIuMVY4MzNoMzM5Ljh2NzYuMnpNODAwLjYgNzI0Yy0yOS4zIDI3LjEtNjMuMyA0OS4xLTEwMC45IDY1LjVsLTI0LjYgMTAuN0gzNDAuNGwtMTgtNy4yYy04OC4zLTM1LjEtMTUyLTk5LjEtMTg5LjQtMTkwLjItMzAtNzMuMi0zNS43LTE0Ni0zNi4yLTE4Ni4yaDgzMC4zYy0wLjkgNzkuMS0yMC4xIDE1NC4yLTU1LjggMjE3LjUtMTkuMiAzNC4xLTQyLjkgNjQuMy03MC43IDg5Ljl6IiBmaWxsPSIiIHAtaWQ9Ijc4NjkiPjwvcGF0aD48L3N2Zz4=',
  hash: true,
  headScripts: [],
  htmlPlugin: {},
  ignoreMomentLocale: true,
  links: [],
  loaderOptions: {
    lessLoader: {},
    scssLoader: {},
    stylusLoader: {},
    styleLoader: {},
    cssLoader: {}
  },
  metas: [],
  mountElementId: 'root',
  outputPath: 'dist',
  plugins: [],
  publicPath: '/',
  scripts: [],
  styles: [],
  targets: { node: true, chrome: 49, firefox: 64, safari: 10, edge: 13, ios: 10 },
  autoprefixer: { autoprefixer: { flexbox: 'no-2009' }, stage: 3 },
  terserOptions: {}
}
export const htmlDefaultOptions = {
  headScripts: [],
  scripts: [],
  styles: [],
  metas: [],
  links: [],
  config: configDefault
}
export default configDefault
