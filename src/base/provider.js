
const Base = require('./base');

class Provider extends Base {

}

Reflect.defineMetadata('type', 'provider', Provider.prototype);

module.exports = Provider;
