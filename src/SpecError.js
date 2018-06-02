/**
 * @file SpecError
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

class SpecError extends Error {
  constructor(message) {
    super(message)
    this.id = 'github-similar-server'
    // https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
    Error.captureStackTrace(this, SpecError)
  }
}

module.exports = SpecError
