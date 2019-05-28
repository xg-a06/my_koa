const EventEmitter = require('events')
const Stream = require('stream')
const http = require('http')
const compose = require('./compose')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const { isJSON } = require('./helper')
class MyKoa extends EventEmitter {
  constructor() {
    super()
    this.middlewares = []
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }
  use(middleware) {
    this.middlewares.push(middleware)
    return this
  }
  listen(...args) {
    let server = http.createServer(this.callback())
    server.listen(...args)
  }
  callback() {
    const fn = compose(this.middlewares) //利用闭包缓存中间件方法队列
    return (req, res) => {
      const ctx = this.createContext(req, res)
      this.handleRequest(ctx, fn)
    }
  }
  createContext(req, res) {
    const context = Object.create(this.context)
    const request = (context.request = Object.create(this.request))
    const response = (context.response = Object.create(this.response))
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = response.res = res
    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    return context
  }
  handleRequest(ctx, fn) {
    ctx.res.statusCode = 404
    ctx.res.statusMessage = 'Not Found'
    const onerror = err => ctx.onerror(err, ctx)
    const handleResponse = () => this.responseBody(ctx)
    return fn(ctx)
      .then(handleResponse)
      .catch(onerror)
  }
  responseBody(ctx) {
    if (!ctx.writable) {
      return
    }
    let { body, res, status } = ctx
    if (status === 204) {
      ctx.body = null
      return res.end()
    }
    if (ctx.method === 'HEAD') {
      if (!res.headersSent && isJSON(body)) {
        ctx.length = Buffer.byteLength(JSON.stringify(body))
      }
      return res.end()
    }

    if (null == body) {
      body = String(ctx.message) || String(status)
      if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body)
      }
      return res.end(body)
    }

    if (Buffer.isBuffer(body)) return res.end(body)
    if (typeof body === 'string') return res.end(body)
    if (body instanceof Stream) return body.pipe(res)
    body = JSON.stringify(body)
    if (!res.headersSent) {
      ctx.length = Buffer.byteLength(body)
    }
    res.end(body)
  }
}

module.exports = MyKoa
