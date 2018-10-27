/**
 * @file markhtml
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

const remark = require('remark')
const reporter = require('vfile-reporter')
const vfile = require('to-vfile')
const remark2rehype = require('remark-rehype')
const raw = require('rehype-raw')
const html = require('rehype-stringify')
const gfm = require('remark-preset-gfm')

const gfmRemark = remark()
  .use(gfm)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(raw)
  .use(html)

module.exports = function(filename) {
  return new Promise((resolve, reject) => {
    let vFile = vfile.readSync(filename)
    let input = vFile.contents.toString()

    gfmRemark.process(vFile, function(err, file) {
      if (err) {
        reject(err)
      }
      if (file.messages && file.messages.length) {
        console.error(reporter(file))
      }
      resolve({ input, output: String(file) })
    })
  })
}

module.exports.gfmRemark = gfmRemark
