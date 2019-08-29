/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');

class Validator extends Base {

}

Reflect.setMetadata('type', 'validator', Validator.prototype);

module.exports = Validator;
