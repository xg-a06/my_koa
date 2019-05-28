const qs = require('qs')

function jsonCallback(data) {
  return JSON.parse(data.toString())
}

function urlencodedCallback(data) {
  return qs.parse(data.toString())
}

function formDataCallback(data, ctx) {
  let boundary = ctx.get('content-type').split('=')[1]
  boundary = '--' + boundary
  return analysisData(Buffer.concat(data), boundary)
}

function splitBuffer(buffer, sep) {
  let arr = []
  let pos = 0
  let sepIndex = -1
  let sepLen = Buffer.from(sep).length
  do {
    sepIndex = buffer.indexOf(sep, pos)
    if (sepIndex == -1) {
      arr.push(buffer.slice(pos))
    } else {
      arr.push(buffer.slice(pos, sepIndex))
    }
    pos = sepIndex + sepLen
  } while (sepIndex !== -1)

  return arr
}

function analysisData(buffer, boundary) {
  let lines = splitBuffer(buffer, boundary)
  lines = lines.slice(1, -1)
  let obj = {}
  lines.forEach(line => {
    line = line.slice(2, -2) //去掉多余的/r/n
    let [head, tail] = splitBuffer(line, '\r\n\r\n')
    let headLen = head.length
    head = head.toString()
    let name = head.match(/name="(\w*)"/)[1]
    let value
    if (head.includes('filename')) {
      value = line.slice(headLen + 4)
    } else {
      value = tail.toString()
    }
    obj[name] = value
  })
  return obj
}

let defaultOpts = {
  enableTypes: ['json', 'form-urlencoded', 'form-data']
}

const enableMap = {
  json: 'application/json',
  'form-urlencoded': 'application/x-www-form-urlencoded',
  'form-data': 'multipart/form-data'
}
const cbMap = {
  'application/json': jsonCallback,
  'application/x-www-form-urlencoded': urlencodedCallback,
  'multipart/form-data': formDataCallback
}

const fns = {}

function checkMap(enableTypes) {
  enableTypes.forEach(item => {
    let key = enableMap[item]
    fns[key] = cbMap[key]
  })
}

function getPostData(ctx) {
  return new Promise((res, rej) => {
    let buf = []
    ctx.req.on('data', chunk => {
      buf.push(chunk)
    })
    ctx.req.on('end', () => {
      res(buf)
    })
  })
}

function bodyparser(options) {
  let opts = Object.assign({}, defaultOpts, options)
  checkMap(opts.enableTypes)
  return async (ctx, next) => {
    if (ctx.method !== 'POST') {
      await next()
      return
    }
    let buf = await getPostData(ctx)
    let fnKey = ctx.get('content-type').split(';')[0]
    if (buf.length > 0 && fns[fnKey]) {
      ctx.req.body = fns[fnKey](buf, ctx)
    }
    await next()
  }
}

module.exports = app => {
  app.use(
    bodyparser({
      enableTypes: ['json', 'form-urlencoded', 'form-data']
    })
  )
}
