const MyKoa = require('./lib/application')

let app = new MyKoa()

const sleep = time =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, time)
  })

app.use(async (ctx, next) => {
  await next()
})

app.use(async (ctx, next) => {
  await sleep(1000)
  await next()
})

app.use(async (ctx, next) => {
  ctx.body = { a: 1, b: 2 }
})

app.on('error', (err, ctx) => {
  console.log('error happends: ', err.stack)
})

app.listen(3000, () => {
  console.log('listenning on 3000')
})
