'use strict'
const merge = require('webpack-merge')
let devEnv

devEnv = require('./dev.env')
const environments = merge(devEnv, {
  NODE_ENV: '"testing"'
})

module.exports = environments
