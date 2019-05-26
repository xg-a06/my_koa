function cookie() {
  return async function(ctx, next) {
    ctx.cookie = function(value) {
      if (/=/.test(value)) {
        ctx.set('Set-Cookie', value)
      } else {
        return _cookie[value]
      }
    }
    let _cookie = {}
    const cookieStr = ctx.get('cookie') || ''
    cookieStr.split(';').forEach(item => {
      if (!item) {
        return
      }
      const arr = item.split('=')
      const key = arr[0].trim()
      const val = arr[1].trim()
      _cookie[key] = val
    })
    await next()
  }
}

module.exports = app => {
  app.use(cookie())
}
