/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const express = require('express')
const nps = require('path')
const request = require('supertest')

const { makeFixture } = require('./helper')
const middleware = require('../src/index')

describe('main', function() {
  const app = express()

  app.use('/case-1', middleware({ root: makeFixture('case-1') }))
  app.use('/case-404', middleware({ root: makeFixture('case-404') }))
  app.use('/case-readme', middleware({ root: makeFixture('case-readme') }))
  app.use('/case-raw', middleware({ root: makeFixture('case-raw') }))
  app.use('/case-zh', middleware({ root: makeFixture('case-zh') }))
  app.use('/case-meta', middleware({ root: makeFixture('case-meta') }))
  app.use('/case-single-file', middleware({ root: makeFixture('single-file.md') }))

  app.use(
    '/case-template-string',
    middleware({
      root: makeFixture('case-zh'),
      markdownTemplateString: '<%=title%> <%=foo%>',
      templateParameters: {
        title: 'abc',
        foo: 'fooo'
      }
    })
  )

  it('should static works when path not found', function(done) {
    request(app)
      .get('/case-1/not_found')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err
        done()
      })
  })

  it('should support meta title firstly', function(done) {
    request(app)
      .get('/case-meta/')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err
        const dom = new DOMParser().parseFromString(res.text, 'text/html')
        expect(dom.title).toBe('metaTitle')
        expect(dom.body.innerHTML).toMatchSnapshot()
        done()
      })
  })

  it('should static works when path not found, but has 404.html', function(done) {
    request(app)
      .get('/case-404/not_found')
      .expect(function(res) {
        expect(res.text).toMatchSnapshot()
      })
      .expect(404)
      .end(done)
  })

  it('should return 302 when directory matched', function(done) {
    request(app)
      .get('/case-readme/readme')
      .expect(function(res) {
        expect(res.text).toMatchSnapshot()
      })
      .expect(302)
      .end(done)
  })

  it('should skip readme when index.html existed', function(done) {
    request(app)
      .get('/case-readme/')
      .expect(function(res) {
        expect(res.text).toBe('index\n')
      })
      .expect(200)
      .end(done)
  })

  it('should redirect to directory', function(done) {
    request(app)
      .get('/case-readme')
      .expect(302)
      .end(done)
  })

  it("should ecstatic's link is correct when has baseUrl", function(done) {
    request(app)
      .get('/case-1/')
      .expect(200)
      .expect(function(res) {
        expect(res.text).not.toContain('<a href="/abc/">')
        expect(res.text).toContain('<a href="/case-1/abc/">')
        expect(res.text).not.toContain('<a href="/haha.html">')
        expect(res.text).toContain('<a href="/case-1/haha.html">')
      })
      .end(done)
  })

  it('should responses raw markdown text when `?raw`', function(done) {
    request(app)
      .get('/case-raw/README.md?raw=true')
      .expect(function(res) {
        expect(res.text).toBe('# raw\n')
      })
      .expect(200)
      .end(function() {
        request(app)
          .get('/case-raw/readme/readme.md?raw=true')
          .expect(function(res) {
            expect(res.text).toBe('## hah\n')
          })
          .expect(200)
          .end(done)
      })
  })

  it('should response html when request path contains chinese', function(done) {
    request(app)
      .get(`/case-zh/${encodeURIComponent('你好 呀')}.md?a=22`)
      .expect(function(res) {
        expect(res.text).toMatchSnapshot()
      })
      .expect(200)
      .end(function() {
        request(app)
          .get(`/case-zh/${encodeURIComponent('你好 呀')}.md?raw=true`)
          .expect(function(res) {
            expect(res.text).toBe('## haha\n')
          })
          .expect(200)
          .end(done)
      })
  })

  it('should response html when through `markdownTemplateString` and `templateParameters`', function(done) {
    request(app)
      .get(`/case-template-string/${encodeURIComponent('你好 呀')}.md`)
      .expect(function(res) {
        expect(res.text).toEqual('你好 呀 fooo')
      })
      .expect(200)
      .end(done)
  })

  it('should works on single-file when root is extract file', function (done) {
    request(app)
      .get('/case-single-file')
      .expect(function(res) {
        expect(res.text).toContain('<p>single</p>\n')
      })
      .expect(200)
      .end(done)
  })

  it('should works on single-file when root is extract file 2', function (done) {
    request(app)
      .get('/case-single-file/')
      .expect(function(res) {
        expect(res.text).toContain('<p>single</p>\n')
      })
      .expect(200)
      .end(done)
  })

  it('should works on single-file when root is extract file (throw error)', function (done) {
    request(app)
      .get('/case-single-file/a')
      .expect(404)
      .end(done)
  })

  it('should works on single-file when root is extract file with query `?raw`', function (done) {
    request(app)
      .get('/case-single-file?raw=true')
      .expect(function(res) {
        expect(res.text).toEqual('single\n')
      })
      .expect(200)
      .end(done)
  })

  it('should githubSimilar.markdown', function () {
    expect(middleware.markdown).toBeInstanceOf(Function)
    expect(middleware.static).toBeInstanceOf(Function)
  })
})
