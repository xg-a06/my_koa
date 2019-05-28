const createError = require('http-errors')
const Delegate = require('./delegate')

const ctx = {
  throw(...args) {
    throw createError(...args)
  },
  onerror(err, ctx) {
    this.app.emit('error', err, this)
    if (err.code === 'ENOENT') {
      ctx.status = 404
    } else {
      ctx.status = 500
      ctx.message = 'Internal error'
    }
    let msg = err.message || 'Internal error'
    ctx.res.end(msg)
  }
}

new Delegate(ctx, 'request')
  .method('get')
  .access('url')
  .getter('querystring')
  .getter('query')
  .getter('search')
  .getter('method')
  .getter('path')
  .getter('origin')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('header')
  .getter('secure')
  .getter('href')

new Delegate(ctx, 'response')
  .method('set')
  .method('append')
  .access('status')
  .access('message')
  .access('body')
  .access('lastModified')
  .access('etag')
  .access('length')
  .access('type')
  .getter('headerSent')
  .getter('writable')

module.exports = ctx
