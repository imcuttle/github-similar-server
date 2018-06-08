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

  it('should static works when path not found', function(done) {
    request(app)
      .get('/case-1/not_found')
      // .expect('Content-Type', /json/)
      // .expect('Content-Length', '15')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err
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
      .get('/case-readme')
      .expect(function(res) {
        expect(res.text).toBe('index\n')
      })
      .expect(200)
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
          .get('/case-raw/readme/README.md?raw=true')
          .expect(function(res) {
            expect(res.text).toBe('## hah\n')
          })
          .expect(200)
          .end(done)
      })
  })

  it('should response html when request path contains chinese', function (done) {
    request(app)
      .get(`/case-zh/${encodeURIComponent('你好 呀')}.md`)
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

})
