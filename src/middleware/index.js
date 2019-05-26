const middlewares = ['log', 'cookie']

module.exports = app => {
  middlewares.forEach(item => {
    let middleware = require(`./${item}`)
    middleware(app)
  })
}
