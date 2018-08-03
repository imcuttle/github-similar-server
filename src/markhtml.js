/**
 * @file markhtml
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

const remark = require('remark')
const unified = require('unified')
const reporter = require('vfile-reporter')
const vfile = require('to-vfile')
const remark2rehype = require('remark-rehype')
const rehypeParse = require('rehype-parse')
const raw = require('rehype-raw')
const html = require('rehype-stringify')

module.exports = function(filename) {
  return new Promise((resolve, reject) => {
    let vFile = vfile.readSync(filename)
    let input = vFile.contents.toString()
    remark()
      .use(require('remark-gemoji-to-emoji'))
      .use(require('remark-slug'))
      .use(require('remark-frontmatter'))
      .use(require('remark-autolink-headings'), {
        content: unified()
          .use(rehypeParse, { fragment: true })
          .parse(
            '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewbox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>'
          ).children,
        linkProperties: {
          className: 'anchor'
        }
      })
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
