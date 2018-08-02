// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

const coverageReporters = [
  { type: 'text-summary' }
]

const reporters = [
  'spec',
  'coverage'
]

// If on Travis, run coveralls to get coverage statement, and edit
// coverage reporter types
if (process.env.TRAVIS) {
  console.log('On Travis sending coveralls')
  coverageReporters.push({ type: 'lcov', dir: 'coverage' })
  reporters.push('coveralls')
} else {
  console.log('Not on Travis so not sending coveralls')
  coverageReporters.push({ type: 'html', dir: 'coverage', 'subdir': '.' })
}

module.exports = function karmaConfig (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    reporters,
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: coverageReporters
    }

  })
}
