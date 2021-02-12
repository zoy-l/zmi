const eslintConifg = require('eslint-config-zmi')
const zmi = require('./lib')

module.exports = Object.assign(zmi, eslintConifg)
