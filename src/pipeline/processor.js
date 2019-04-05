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
  process(stages, cb, ...payload) {
    const nextFn = this.getNextFn(cb);
    const callback = stages
      .reduceRight(
        (next, pipe) => (...data) => pipe(...data, next.bind(null, ...data)),
        nextFn,
      );
    return Promise.resolve(callback(...payload));
  }

  getNextFn(fn) {
    if (typeof fn !== 'function') throw new TypeError('process callback must be a function');
    return (...payload) => fn(...payload);
  }
}

module.exports = Processor;
