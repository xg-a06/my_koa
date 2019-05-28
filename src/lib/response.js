const getType = require('cache-content-type')
const { isJSON } = require('./helper')

const request = {
  get headerSent() {
    return this.res.headersSent
  },
  get writable() {
    if (this.res.finished) {
      return false
    }
    const socket = this.res.socket
    if (!socket) {
      return true
    }
    return socket.writable
  },
  set(field, val) {
    if (this.headerSent) return
    if (arguments.length === 2) {
      if (typeof val !== 'string') {
        val = String(val)
      }
      this.res.setHeader(field, val)
    } else {
      for (const key in field) {
        this.set(key, field[key])
      }
    }
  },
  get header() {
    return this.res.getHeaders()
  },
  get(field) {
    return this.header[field.toLowerCase()] || ''
  },
  remove(field) {
    if (this.headerSent) return
    this.res.removeHeader(field)
  },
  append(field, val) {
    const prev = this.get(field)
    if (prev) {
      val = prev.concat(val)
    }
    return this.set(field, val)
  },
  get status() {
    return this.res.statusCode
  },
  set status(code) {
    if (this.headerSent) return
    this.hasSetStatus = true
    this.res.statusCode = code
  },
  get message() {
    return this.res.statusMessage
  },
  set message(msg) {
    this.res.statusMessage = msg
  },
  set lastModified(val) {
    if ('string' == typeof val) val = new Date(val)
    this.set('Last-Modified', val.toUTCString())
  },
  get lastModified() {
    const date = this.get('last-modified')
    if (date) return new Date(date)
  },
  set etag(val) {
    this.set('ETag', val)
  },
  get etag() {
    return this.get('ETag')
  },
  set length(n) {
    this.set('Content-Length', n)
  },
  get length() {
    const len = this.header['content-length']
    const body = this.body
    if (!len) {
      if (!body) return
      if ('string' == typeof body) return Buffer.byteLength(body)
      if (Buffer.isBuffer(body)) return body.length
      if (isJSON(body)) return Buffer.byteLength(JSON.stringify(body))
      return
    }
    return Math.trunc(len) || 0
  },
  get body() {
    return this._body
  },
  set body(val) {
    this._body = val
    if (!val) {
      this.status = 204
      this.remove('Content-Type')
      this.remove('Content-Length')
      return
    }
    if (!this.hasSetStatus) {
      this.status = 200
    }
    const notSetType = !this.header['content-type']

    if ('string' == typeof val) {
      if (notSetType) {
        this.type = /^\s*</.test(val) ? 'html' : 'text'
      }
      this.length = Buffer.byteLength(val)
      return
    }

    if (Buffer.isBuffer(val)) {
      if (notSetType) {
        this.type = 'bin'
      }
      this.length = val.length
      return
    }

    if ('function' == typeof val.pipe) {
      if (setType) this.type = 'bin'
      return
    }
    this.remove('Content-Length')
    this.type = 'json'
  },
  get type() {
    const type = this.get('Content-Type')
    if (!type) return ''
    return type
  },
  set type(type) {
    type = getType(type)
    if (type) {
      this.set('Content-Type', type)
    } else {
      this.remove('Content-Type')
    }
  }
}

module.exports = request
