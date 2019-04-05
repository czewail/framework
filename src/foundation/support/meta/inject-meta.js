
const Meta = require('./index');

const INJECT_META = Symbol('inject-meta');

class InjectMeta extends Meta {

}

InjectMeta.meta = INJECT_META;

module.exports = InjectMeta;
