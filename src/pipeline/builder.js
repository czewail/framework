const Pipeline = require('./index');

/**
 * Pipeline Builder
 */
class Builder {
  stages = [];

  /**
   * add pipe stage
   * @param {Function} stage pipe stage
   * @returns {Builder} this
   */
  add(stage) {
    this.stages.push(stage);
    return this;
  }

  /**
   * build a Piepeline instance
   * @param {Processor} processor pipe processor
   */
  build(processor = null) {
    return new Pipeline(processor, ...this.stages);
  }
}


module.exports = Builder;
