/**
 * Pipeline Processor
 */
class Processor {
  /**
   * run Pipeline Processor
   * @param {mixed} payload pipe data payload
   * @param  {Array<Function>} stages pipe stage
   * @returns {Promise} Processor result
   */
  async process(stages, processor, ...payload) {
    const callback = stages
      .reduceRight(
        (next, pipe) => async (...data) => pipe(...data, next.bind(null, ...data)),
        async (...params) => processor(...params),
      );
    return callback(...payload);
  }
}

module.exports = Processor;
