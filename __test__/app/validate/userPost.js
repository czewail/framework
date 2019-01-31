const { Validate } = require('../../../src/index')

const { Email } = Validate

class UserPost {
  @Email()
  username;
}

module.exports = UserPost
