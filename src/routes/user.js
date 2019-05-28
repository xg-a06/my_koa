const Router = require('../middleware/router')

const router = new Router()

router.prefix('/users')

router.get('/:id', function(ctx, next) {
  ctx.body = 'this is a users response' + JSON.stringify(ctx.params)
  next()
})
router.get('/bar', function(ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
