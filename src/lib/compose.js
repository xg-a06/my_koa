function compose(middlewares) {
  return ctx => {
    let index = -1
    const dispatch = i => {
      if (i <= index) {
        //在一个中间键方法中调用多次next是不允许的,会错乱
        return Promise.reject(new Error('next() 被调用多次'))
      }
      index = i
      let fn = middlewares[i]
      if (!fn) {
        return Promise.resolve()
      }
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return dispatch(0)
  }
}

module.exports = compose
