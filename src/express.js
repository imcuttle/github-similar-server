/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/2
 * @description
 */

const express = require('express')
const ecstatic = require('ecstatic')
const nps = require('path')
const nrl = require('url')
const pify = require('pify')
const template = require('lodash.template')
const debug = require('debug')('github-similar-server:express')

const SpecError = require('./SpecError')
const fs = require('./fs')
const markhtml = require('./markhtml')

function renderMarkdown(
  res,
  filename,
  next,
  { markdownTemplate = nps.join(__dirname, 'template.html') } = {}
) {
  markhtml(filename)
    .then(function({ output }) {
      return pify(fs.readFile)(markdownTemplate, {
        encoding: 'utf8'
      }).then(templateString => ({
        templateString,
        output
      }))
    })
    .then(({ templateString, output }) => {
      res.type('html')
      res.send(
        template(templateString)({
          filename,
          title: nps.basename(filename, nps.extname(filename)),
          markdownHTML: output
        })
      )
    })
    .then()
    .catch(next)
}

function markdown(options = {}) {
  const { root } = options

  return function(req, res, next) {
    debug('req.url', req.url)
    debug('req.originalUrl', req.originalUrl)
    debug('req.baseUrl', req.baseUrl)
    
    if (req.query.raw) {
      // 返回原始数据
      return next()
    }

    const url = req.url
    const filename = nps.join(root, url)
    debug('filename', filename)

    if (
      fs.isFile(filename) &&
      ['.md', '.markdown'].includes(nps.extname(filename).toLowerCase())
    ) {
      renderMarkdown(res, filename, next, options)
    } else if (
      fs.isDirectory(filename) &&
      !fs.isFile(nps.join(filename, 'index.html')) &&
      !fs.isFile(filename + '.html')
    ) {
      let obj = nrl.parse(url)
      if (!obj.pathname.endsWith('/')) {
        obj.pathname = obj.pathname + '/'
        return res.redirect(nrl.format(obj))
      }

      let founded = ['Readme.md', 'readme.md', 'README.md', 'index.md']
        .map(name => nps.join(filename, name))
        .some(filename => {
          if (fs.isFile(filename)) {
            renderMarkdown(res, filename, next, options)
            return true
          }
        })

      if (!founded) {
        next()
      }
    } else {
      next()
    }
  }
}

const DEFAULT_OPTIONS = {
  enableMarkdown: true,
  enableStatic: true,
  cache: 'max-age=-1'
}
function githubSimilar(options = {}) {
  if (typeof options.root !== 'string') {
    throw new SpecError(
      'expect `root` is belongs to string, but ' + typeof options.root + '.'
    )
  }

  options = Object.assign({}, DEFAULT_OPTIONS, options)
  debug('options:', options)

  return [
    options.enableMarkdown && markdown(options),
    options.enableStatic && ecstatic(options)
  ].filter(Boolean)
}

githubSimilar.markdown = markdown
module.exports = githubSimilar
