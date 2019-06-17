const Processor = require('./processor');

/**
 * Pipeline
 */
class Pipeline {
  constructor(processor = null, ...stages) {
    this.processor = processor || new Processor();
    this.stages = stages;
  }

  /**
   * add pipe stage
   * @param {Function} stage pipe stage
   * @returns {Pipeline} this
   */
  pipe(stage) {
    if (typeof stage === 'function') {
      this.stages.push(stage);
    } else if (Array.isArray(stage)) {
      for (const item of stage) {
        this.pipe(item);
      }
    }
    return this;
  }

  send(...payload) {
    this.payload = payload;
    return this;
  }

  /**
   * run pipeline
   * @param {mixed} payload pipe data payload
   * @returns {mixed} result
   */
  async process(processor) {
    if (this.stages.length > 0) {
      return this.processor.process(this.stages, processor, ...this.payload);
    }
    return processor(...this.payload);
  }
}

module.exports = Pipeline;
