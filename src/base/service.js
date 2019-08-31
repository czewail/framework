/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');

class Service extends Base {

}

Reflect.defineMetadata('type', 'service', Service.prototype);

module.exports = Service;
