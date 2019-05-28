const compose = require('../lib/compose')
const initProto = Symbol('initProto')

class Router {
  constructor() {
    this.opts = {}
    this.stack = []
    this.methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'POST', 'DELETE']
    this[initProto]()
  }

  register(method, path, fn) {
    let _path = this.opts.prefix ? this.setPrefix(path) : path
    let route = {
      method,
      path: _path,
      fn
    }
    if (path.includes(':')) {
      let params = []
      let reg = _path.replace(/:([^/]*)/g, function() {
        params.push(arguments[1])
        return '([^/]*)'
      })
      route.reg = new RegExp(reg + '/?$')
      route.params = params
    }
    this.stack.push(route)
  }
  [initProto]() {
    this.methods.forEach(method => {
      Router.prototype[method.toLowerCase()] = function(path, ...callback) {
        this.register(method, path, callback)
        return this
      }
    })
  }
  setPrefix(path) {
    return this.opts.prefix + (path === '/' ? '' : path)
  }
  prefix(prefix) {
    prefix = prefix.replace(/\/$/, '') //去掉结尾/
    this.opts.prefix = prefix
    //如果后添加前缀,那么遍历已注册的路由添加前缀
    this.stack.forEach(route => {
      route.path = this.setPrefix(route.path)
    })

    return this
  }
  pathReg(route) {
    return route.reg || new RegExp(`^${route.path}\/?$`)
  }
  match(path, method) {
    let hasAb = false //是否有绝对匹配
    let matches = this.stack.filter(route => {
      if (this.pathReg(route).test(path) && route.method === method) {
        if (!route.reg) {
          hasAb = true
        }
        return true
      }
    })
    if (hasAb) {
      matches = matches.filter(route => !route.reg)
    }

    return matches
  }
  routes() {
    return (ctx, next) => {
      let matches = this.match(ctx.path, ctx.method)
      if (matches.length > 0 && matches[0].reg) {
        let regRet = ctx.path.match(matches[0].reg)
        let params = {}
        matches[0].params.forEach((item, index) => {
          params[item] = regRet[index + 1]
        })
        ctx.params = params
      }
      let fns = []
      if (matches.length > 0) {
        fns = matches
          .map(temp => temp.fn)
          .reduce((a, b) => {
            return a.concat(b)
          })
      }
      return compose(fns)(ctx, next)
    }
  }
}

module.exports = Router
