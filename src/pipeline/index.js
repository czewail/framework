const Processor = require('./processor');

/**
 * Pipeline
 */
class Pipeline {
  constructor(processor = null, ...stages) {
    this.processor = processor || Processor;
    this.stages = stages;
  }

  /**
   * add pipe stage
   * @param {Function} stage pipe stage
   * @returns {Pipeline} this
   */
  pipe(stage) {
    this.stages.push(stage);
    return this;
  }

  /**
   * run pipeline
   * @param {mixed} payload pipe data payload
   * @returns {mixed} result
   */
  process(payload) {
    return this.processor.process(payload, ...this.stages);
  }
}

module.exports = Pipeline;
