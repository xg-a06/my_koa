const compose = require('../lib/compose')
const initProto = Symbol('initProto')

class Router {
  constructor() {
    this.stack = []
    this.methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'POST', 'DELETE']
    this[initProto]()
  }
  register(method, path, fn) {
    let route = {
      method,
      path,
      fn
    }
    this.stack.push(route)
  }
  [initProto]() {
    this.methods.forEach(method => {
      Router.prototype[method.toLowerCase()] = function(path, callback) {
        this.register(method, path, callback)
        return this
      }
    })
  }
  match(path, method) {
    return this.stack
      .filter(route => {
        return route.path === path && route.method === method
      })
      .map(temp => temp.fn)
  }
  routes() {
    return (ctx, next) => {
      return compose(this.match(ctx.path, ctx.method))(ctx, next)
    }
  }
}

module.exports = Router
