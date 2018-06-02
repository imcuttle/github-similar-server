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

module.exports = function(filename) {
  return new Promise((resolve, reject) => {
    let vFile = vfile.readSync(filename)
    let input = vFile.contents.toString()
    remark()
      .use(require('remark-gemoji-to-emoji'))
      .use(require('remark-slug'))
      .use(require('remark-autolink-headings'))
      .use(require('remark-highlight.js'))
      .use(remark2rehype, { allowDangerousHTML: true })
      .use(raw)
      .use(html)
      .process(vFile, function(err, file) {
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
