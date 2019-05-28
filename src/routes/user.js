const Router = require('../middleware/router')

const router = new Router()

router.prefix('/users')

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response'
})
router.get('/:id', function(ctx, next) {
  ctx.body = 'this is a users response' + JSON.stringify(ctx.params)
})
router.get('/login', function(ctx, next) {
  ctx.cookie('userid=123; path=/; httpOnly;')
  ctx.body = 'this is login response'
})

module.exports = router
