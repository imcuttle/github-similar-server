#!/usr/bin/env node
const debug = require('debug')('github-similar-server:cli')
const argv = require('minimist')(process.argv.slice(2))
const server = require('./')

const opt = {
  help: argv.h || argv.help,
  port: argv.p || argv.port || 8080,
  version: argv.v || argv.version,
  disableMarkdown: !!argv['disable-markdown'],
  disableStatic: !!argv['disable-static'],
  markdownTemplate: argv['markdown-template'],
  silent: !!argv['silent'],
  root: (argv._ && argv._[0]) || process.cwd()
}

debug('argv', argv)
debug('opt', opt)
;(function() {
  if (opt.version) {
    console.log(require('./package').version)
    return
  }

  if (opt.help) {
    console.log(`
  Usage
    $ github-similar-server [path] <options>

  Options
    -h, --help             Show help
    -v, --version          Show version
    -p, --port             Set server's port                   [default 8080]
    --silent               Do not log anything                 [default false]
    --disable-markdown     Disable markdown render
    --disable-static       Disable static file service
    --markdown-template    The template of markdown's template
`)
    return
  }

  server({
    port: opt.port,
    enableMarkdown: !opt.disableMarkdown,
    enableStatic: !opt.disableStatic,
    root: opt.root,
    silent: opt.silent,
    markdownTemplate: opt.markdownTemplate
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
})()
