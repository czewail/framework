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
  async process(stages, cb, ...payload) {
    const nextFn = this.getNextFn(cb);
    const callback = stages
      .reduceRight(
        (next, pipe) => async (...data) => pipe(...data, next.bind(null, ...data)),
        nextFn,
      );
    return callback(...payload);
  }

  getNextFn(fn) {
    if (typeof fn !== 'function') throw new TypeError('process callback must be a function');
    return async (...payload) => fn(...payload);
  }
}

module.exports = Processor;
