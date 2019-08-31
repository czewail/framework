/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');

class Middleware extends Base {

}

Reflect.defineMetadata('type', 'middleware', Middleware.prototype);

module.exports = Middleware;
