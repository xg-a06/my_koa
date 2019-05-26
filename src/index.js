const MyKoa = require('./lib/application')
const useMiddlewares = require('./middleware')

let app = new MyKoa()

useMiddlewares(app)

app.use(async (ctx, next) => {
  ctx.body = { a: 1, b: 2, cookie: ctx.cookie('test') }
})
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
