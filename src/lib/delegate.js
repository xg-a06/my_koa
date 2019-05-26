class Delegate {
  constructor(proto, target) {
    this.proto = proto
    this.target = target
  }
  method(name) {
    let { proto, target } = this
    proto[name] = function(...args) {
      return this[target][name](...args)
    }
    return this
  }
  access(name) {
    let { proto, target } = this
    Object.defineProperty(proto, name, {
      get() {
        return this[target][name]
      },
      set(value) {
        this[target][name] = value
      }
    })
    return this
  }
  getter(name) {
    let { proto, target } = this
    Object.defineProperty(proto, name, {
      get() {
        return this[target][name]
      }
    })
    return this
  }
}

module.exports = Delegate
