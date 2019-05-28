const Router = require('../middleware/router')

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'hello koa2'
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string1'
  await next()
  ctx.body = ctx.body + 'koa2 string1111'
})

router.get('/string', async (ctx, next) => {
  ctx.body = ctx.body + 'koa2 string2'
  await next()
  ctx.body = ctx.body + 'koa2 string222'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
