const middlewares = ['log', 'static', 'view', 'cookie', 'bodyparser']

module.exports = app => {
  middlewares.forEach(item => {
    let middleware = require(`./${item}`)
    middleware(app)
  })
}
