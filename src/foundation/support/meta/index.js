
const META = Symbol('meta');

class Meta {
  static check(target) {
    if (!target[this.meta]) {
      target[this.meta] = new Map();
    }
  }

  static set(key, value, target) {
    this.check(target);
    target[this.meta].set(key, value);
  }

  static get(key, target) {
    if (!target[this.meta]) return undefined;
    return target[this.meta].get(key);
  }

  static has(key, target) {
    if (!target[this.meta]) return false;
    return target[this.meta].has(key) || false;
  }
}

Meta.meta = META;

module.exports = Meta;
