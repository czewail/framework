

class Processor {
  process(payload, ...stages) {
    try {
      return Promise.resolve(this.dispatch(payload, stages))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  dispatch(payload, stages) {
    let _payload = payload
    for (const stage of stages) {
      _payload = stage(_payload)
    }
    return _payload
  }
}

module.exports = Processor
