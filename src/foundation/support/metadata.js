/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const METADATA = Symbol('metadata');

class Metadata {
  static has(key, target) {
    if (!target || !target[METADATA]) return false;
    return target[METADATA].has(key) || false;
  }

  static get(key, target) {
    if (!target || !target[METADATA]) return undefined;
    return target[METADATA].get(key);
  }

  static set(key, value, target) {
    if (!target[METADATA]) {
      target[METADATA] = new Map();
    }
    if (target) {
      target[METADATA].set(key, value);
      return true;
    }
    return false;
  }
}

module.exports = Metadata;
