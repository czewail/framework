const Processor = require('./processor')

class Pipeline {
  stages = [];

  processor = null;

  constructor(processor = null, ...stages) {
    this.processor = processor || new Processor()
    this.stages = stages
  }

  pipe(stage) {
    this.stages.push(stage)
    return this
  }

  process(payload) {
    return this.processor.process(payload, ...this.stages)
  }
}

module.exports = Pipeline
