/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const nps = require('path')

const { makeFixture } = require('./helper')
const markhtml = require('../src/markhtml')

describe('main', function() {
  it('should ', function (done) {
    markhtml('./fixture/markdownDemo.md')
      .then(output => {
        console.error(output.input)
        console.error(output.output)
      })
      .then(done)
      .catch(done)
  })
})
