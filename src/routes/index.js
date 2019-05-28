const Router = require('../middleware/router')

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'hello koa2'
})

router.get(
  '/string',
  async (ctx, next) => {
    if (!ctx.cookie('userid')) {
      ctx.throw(401, 'not login')
    }
    await next()
  },
  async (ctx, next) => {
    ctx.body = 'koa2 string2'
    await next()
    ctx.body = ctx.body + 'koa2 string222'
  }
)

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
