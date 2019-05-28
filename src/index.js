const MyKoa = require('./lib/application')
const useMiddlewares = require('./middleware')
const Router = require('./middleware/router')

const sleep = t =>
  new Promise((res, rej) =>
    setTimeout(() => {
      res()
    }, t)
  )

let app = new MyKoa()

useMiddlewares(app)

const router = new Router()

router.get('/string/aaa', async (ctx, next) => {
  ctx.body = 'string1 '
  await next()
  ctx.body = ctx.body + 'string1111 '
})

router.get('/string', async (ctx, next) => {
  ctx.body = ctx.body + 'string2 '
  await sleep(1000)
  await next()
  ctx.body = ctx.body + 'string2222 '
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

app.use(router.routes())
// app.use(async (ctx, next) => {
//   try {
//     await next()
//   } catch (err) {
//
//   }
// })
app.on('error', (err, ctx) => {
  console.log('error happends: ', err.stack)
})

app.listen(3000, () => {
  console.log('listenning on 3000')
})
