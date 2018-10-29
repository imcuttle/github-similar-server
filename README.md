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

#### `root`

github-similar-server works on which file or folder. (_required_)

- Type: `string`

#### `port`

the service port

- Type: `number`
- Default: `8080`

#### `basePath`

the service's base path

- Type: `string`
- Default: `'/'`

#### `silent`

Do not log anything

- Type: `boolean`
- Default: `false`

#### `enableMarkdown`

Enable markdown render

- Type: `boolean`
- Default: `true`

#### `enableStatic`

Enable static file service

- Type: `boolean`
- Default: `true`

#### `markdownTemplate`

The path of markdown's template

- Type: `string`
- Default: [`./src/template.html`](./src/template.html)

#### `markdownTemplateString`

The string source of markdown's template, It has more higher priority. 

- Type: `string`

#### `templateParameters`

Extra parameters of template

- Type: `{}`

#### `cache`

- Type: `string`
- Default: `'max-age=-1'`

#### `baseDir`

`baseDir` is not recommended to be assigned if you don't know what you are doing.

Because it has some troubles in ecstatic. https://github.com/jfhbrook/node-ecstatic/issues/235 

- Type: `string`
- Default: `req.baseUrl`

**Rest options extend [ecstatic](https://github.com/jfhbrook/node-ecstatic) options**

## Rule

1. Support gfm and render github style markdown when visit `/README.md` or `/path/to/md.md`.

2. The service would response index.html when contains index.html and README.md via url `/`.

3. It would response raw markdown text when with query string `?raw=true`.

## About markdownTemplate

Use [Lodash.template](https://lodash.com/docs/4.17.10#template) with template data:

* title
* markdownHTML
* filename

## Related

- [remark-preset-gfm](https://github.com/imcuttle/remark-preset-gfm) - Remark preset for gfm (GitHub Favorite Markdown)

## License

MIT
