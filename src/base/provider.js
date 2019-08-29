
const Base = require('./base');

class Provider extends Base {

}

Reflect.setMetadata('type', 'provider', Provider.prototype);

module.exports = Provider;
