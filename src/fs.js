/**
 * @file fs
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

const fs = require('fs')

module.exports = Object.assign({
  isFile(name) {
    return fs.existsSync(name) && fs.statSync(name).isFile()
  },
  isDirectory(name) {
    return fs.existsSync(name) && fs.statSync(name).isDirectory()
  }
}, fs)
