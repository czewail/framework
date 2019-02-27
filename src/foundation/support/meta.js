
const META = Symbol('meta')

class Meta {
  static check(target) {
    if (!target[META]) {
      target[META] = new Map()
    }
  }

  static set(key, value, target) {
    this.check(target)
    target[META].set(key, value)
  }

  static get(key, target) {
    if (!target[META]) return
    return target[META].get(key)
  }

  static has(key, target) {
    if (!target[META]) return false
    return target[META].has(key) || false
  }
}

module.exports = Meta
