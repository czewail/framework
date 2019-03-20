const Pipeline = require('./index')

class Builder {
  stages = [];


  add(stage) {
    this.stages.push(stage)
    return this
  }

  build(processor = null) {
    return new Pipeline(processor, ...this.stages)
  }
}


module.exports = Builder
