/**
 * Pipeline Processor
 */
class Processor {
  /**
   * run Pipeline Processor
   * @param {mixed} payload pipe data payload
   * @param  {...Function} stages pipe stage
   * @returns {Promise} Processor result
   */
  static process(payload, ...stages) {
    try {
      return Promise.resolve(this.dispatch(payload, stages));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Processor dispatch
   * @param {mixed} payload pipe data payload
   * @param {...Function} stages pipe stage
   * @returns {mixed} pipe data payload
   */
  static dispatch(payload, stages) {
    let nextPayload = Promise.resolve(payload);
    for (const stage of stages) {
      // nextPayload = stage(nextPayload);
      nextPayload = nextPayload.then(res => stage(res));
    }
    return nextPayload;
  }
}

module.exports = Processor;
