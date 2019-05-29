const path = require('path')
const consolidate = require('consolidate')

let defaultOpts = {
  extension: 'ejs'
}

function views(p, options) {
  let opt = Object.assign({}, defaultOpts, options)
  return async (ctx, next) => {
    let { extension } = opt
    let render = consolidate[extension]
    ctx.render = async (filename, obj) => {
      let realPath = path.join(p, `${filename}.${extension}`)
      let html = await render(realPath, obj)
      ctx.body = html
    }
    await next()
  }
}

module.exports = app => {
  app.use(
    views(path.join(__dirname, '../views'), {
      extension: 'pug'
    })
  )
}
