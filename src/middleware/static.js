const path = require('path')
const fs = require('fs')
const { promisify } = require('util') //将函数promise化
const statPromise = promisify(fs.stat)
const mime = require('mime')

function static(p) {
  return async (ctx, next) => {
    let pathname = ctx.path
    let realPath = path.join(p, pathname)
    try {
      let statObj = await statPromise(realPath)
      if (statObj.isFile()) {
        //如果是文件则读取文件，并且设置好相应的响应头
        ctx.set('Content-Type', mime.getType(realPath) + ';charset=utf-8')
        ctx.body = fs.createReadStream(realPath)
      } else {
        let filename = path.join(realPath, 'index.html')
        await statPromise(filename)
        ctx.set('Content-Type', 'text/html;charset=utf-8')
        ctx.body = fs.createReadStream(filename)
      }
    } catch (e) {
      await next()
    }
  }
}

module.exports = app => {
  app.use(static(path.join(__dirname, '../public')))
}
