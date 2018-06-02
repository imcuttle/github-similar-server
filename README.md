# github-similar-server

[![build status](https://img.shields.io/travis/imcuttle/github-similar-server/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/github-similar-server)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/github-similar-server.svg?style=flat-square)](https://codecov.io/github/imcuttle/github-similar-server?branch=master)
[![NPM version](https://img.shields.io/npm/v/github-similar-server.svg?style=flat-square)](https://www.npmjs.com/package/github-similar-server)
[![NPM Downloads](https://img.shields.io/npm/dm/github-similar-server.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/github-similar-server)

A github similar static server

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
app.use('__', gss)

// Or create an express server
gss({
  port: 10000, // required!
  basePath: '/' // public path
}).then(app => {
  // some code here
})
```

## Options

    port                Set server's port                   [default 8080]
    silent              Do not log anything                 [default false]
    disableMarkdown     Disable markdown render
    disableStatic       Disable static file service
    markdownTemplate    The template of markdown's template

And extends [ecstatic](https://github.com/jfhbrook/node-ecstatic) options
