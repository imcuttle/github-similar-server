/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

const debug = require('debug')('github-similar-server')
const express = require('express')
const morgan = require('morgan')

const middleware = require('./express')

function start(options = {}) {
  const { basePath = '/', port, silent } = options
  debug('start option', arguments[0])

  if (!port) {
    return middleware(options)
  }

  const app = express()
  !silent && app.use(morgan('combined'))
  app.use(basePath, middleware(options))

  return new Promise((resolve, reject) => {
    let server = app.listen(port, function(err) {
      if (err) reject(err)
      else {
        !silent && console.log('Server run on http://localhost:' + port)
        app.close = function (callback) {
          server.close(callback)
        }
        resolve(app)
      }
    })
  })
}

Object.assign(start, middleware)
module.exports = start
