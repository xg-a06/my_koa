const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
  writeStream.write(log + '\n')
}

function createWriteStream(fileName, dir) {
  const fullFileName = path.join(dir, fileName)
  try {
    fs.readdirSync(dir)
  } catch (err) {
    fs.mkdirSync(dir)
  }
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  return writeStream
}

function wrapper(writeStream) {
  return function(log) {
    writeLog(writeStream, log)
  }
}

let defaultOptions = {
  name: 'access.log',
  dir: path.join(__dirname, '../', '../', 'logs')
}

function logger(options = {}) {
  let _options = Object.assign({}, defaultOptions, options)
  const accessWriteStream = createWriteStream(_options.name, _options.dir)
  const access = wrapper(accessWriteStream)
  return async function(ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    access(`${ctx.method} -- ${ctx.url} -- ${ctx.get('user-agent')} -- ${ms}ms`)
  }
}

module.exports = app => {
  app.use(logger({ name: 'log.log' }))
}
