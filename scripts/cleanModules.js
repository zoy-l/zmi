const { exec } = require('child_process')
const rimraf = require('rimraf')
const path = require('path')

exec('lerna clean --ignore @zmi/webpack --yes', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
  } else {
    console.log(stdout)
    console.log(stderr)
    // will cause webpack types errors
    rimraf.sync(path.join(__dirname, '../packages/zmi-webpack/node_modules/@types'))
  }
})
