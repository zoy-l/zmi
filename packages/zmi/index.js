const eslintConifg = { configs: require('eslint-config-zmi').configs }
const zmi = require('./lib')

module.exports = Object.assign(zmi, eslintConifg)
