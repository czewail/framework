/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const assert = require('assert');
const is = require('core-util-is');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Pipeline {
  /**
   * Create Pipeline Instance
   * @param  {...Function} stages
   */
  constructor(...stages) {
    /**
     * @type {Array} stages pipe stages
     */
    this.stages = stages;
  }

  /**
   * add pipe stage
   * @param {...Function} stages pipe stages
   * @returns {Pipeline} this
   */
  pipe(...stages) {
    for (const stage of stages) {
      assert(is.isFunction(stage), new IllegalArgumentError('pipe stage must be function'));
      this.stages.push(stage);
    }
    return this;
  }

  /**
   * send payloads
   * @param  {...*} payload
   * @returns {Pipeline} this
   */
  send(...payload) {
    this.payload = payload;
    return this;
  }

  /**
   * run pipeline
   * @param {*} processor pipe data payload
   * @returns {*} result
   */
  async process(processor) {
    if (this.stages.length > 0) {
      const callback = this.stages
        .reduceRight(
          (next, pipe) => async (...data) => pipe(...data, next.bind(null, ...data)),
          async (...params) => processor(...params),
        );
      return callback(...this.payload);
    }
    return processor(...this.payload);
  }
}

module.exports = Pipeline;
