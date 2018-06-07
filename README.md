# github-similar-server

[![build status](https://img.shields.io/travis/imcuttle/github-similar-server/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/github-similar-server)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/github-similar-server.svg?style=flat-square)](https://codecov.io/github/imcuttle/github-similar-server?branch=master)
[![NPM version](https://img.shields.io/npm/v/github-similar-server.svg?style=flat-square)](https://www.npmjs.com/package/github-similar-server)
[![NPM Downloads](https://img.shields.io/npm/dm/github-similar-server.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/github-similar-server)

A github similar static server with a markdown renderer.

## Usage

### CLI

```bash
npm i github-similar-server -g
github-similar-server -h
```

### Package

```bash
npm i github-similar-server --save
```

```javascript
const app = require('express')()
const gss = require('github-similar-server')

// Use as middleware
app.use('__', gss())

// Or create an express server
const gssApp = gss({
  port: 10000, // required!
  basePath: '/' // public path
}).then(app => {
  // some code here
})

// gssApp.close(() => { console.log('closed') })
```

## Options

    port                Set server's port                   [default 8080]
    silent              Do not log anything                 [default false]
    enableMarkdown      Enable markdown render              [default true]
    enableStatic        Enable static file service          [default true]
    markdownTemplate    The template of markdown's template

And extends [ecstatic](https://github.com/jfhbrook/node-ecstatic) options

## Rule

1. Support gfm and render github style markdown when visit `/README.md` or `/path/to/md.md`.

2. The service would response index.html when contains index.html and README.md via url `/`.

3. It would response raw markdown text when with querystring `?raw`.

## About markdownTemplate

Use [Lodash.template](https://lodash.com/docs/4.17.10#template) with template data:

* title
* markdownHTML
* filename

## License

MIT
