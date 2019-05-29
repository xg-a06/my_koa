const MyKoa = require('./lib/application')
const useMiddlewares = require('./middleware')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

let app = new MyKoa()

useMiddlewares(app)

app.use(indexRouter.routes())
app.use(userRouter.routes())
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
