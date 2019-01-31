const { Resource } = require('../../../src/index')

class Color extends Resource.Transformer {
  toJSON({ color }) {
    return {
      color: `not ${color}`
    }
  }
}

module.exports = Color
