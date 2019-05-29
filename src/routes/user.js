const fs = require('fs')
const path = require('path')
const Router = require('../middleware/router')

const router = new Router()

router.prefix('/users')

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response'
})
router.get('/:id', function(ctx, next) {
  ctx.body = 'this is a users response' + JSON.stringify(ctx.params)
})
router.post('/login', function(ctx, next) {
  ctx.cookie('userid=123; path=/; httpOnly;')
  ctx.body = `this is login response${JSON.stringify(ctx.req.body)}`
  if (ctx.req.body.hasOwnProperty('file1')) {
    fs.writeFileSync(
      path.resolve(__dirname, `../../upload/xxx.png`),
      ctx.req.body.file1
    )
  }
})

module.exports = router
