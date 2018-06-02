/**
 * @file helper
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */
const nps = require('path')

exports.makeFixture = function (name) {
  return nps.join(__dirname, 'fixture', name || '')
}
