const url = require('url')

const request = {
  //获取请求头
  //获取请求头中的某一项
  get(field) {
    const req = this.req
    switch ((field = field.toLowerCase())) {
      case 'referer':
      case 'referrer':
        return req.headers.referrer || req.headers.referer || ''
      default:
        return req.headers[field] || ''
    }
  },
  get header() {
    return this.req.headers
  },
  //获取请求url
  get url() {
    return this.req.url
  },
  //设置请求url
  set url(val) {
    this.req.url = val
  },
  get query() {
    return url.parse(this.req.url, true).query
  },
  get querystring() {
    return url.parse(this.req.url).query
  },
  get search() {
    if (!this.querystring) return ''
    return `?${this.querystring}`
  },
  get method() {
    return this.req.method
  },
  get path() {
    return url.parse(this.req.url).pathname
  },
  get host() {
    let host = ''
    if (this.req.httpVersionMajor >= 2) {
      host = this.get(':authority')
    }
    if (!host) {
      host = this.get('Host')
    }
    return host
  },
  get hostname() {
    const host = this.host
    if (!host) return ''
    return host.split(':', 1)[0]
  },
  get protocol() {
    return this.req.socket.encrypted ? 'https' : 'http'
  },
  get secure() {
    return this.protocol === 'https'
  },
  get origin() {
    return `${this.protocol}://${this.host}`
  },
  get href() {
    return this.origin + this.url
  }
}

module.exports = request
