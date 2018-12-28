

const Validate = require('./validate')
const Decorators = require('./decorators')

const keys = Object.keys(Decorators)

for (const key of keys) {
  Validate[key] = Decorators[key]
}

module.exports = Validate
