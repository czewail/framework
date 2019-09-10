
const createInjectDecorator = require('./factory/create-inject-decorator');
const symbols = require('../symbol');

exports.useService = createInjectDecorator(symbols.INJECTORS.SERVICE);
exports.useValidator = createInjectDecorator(symbols.INJECTORS.VALIDATOR);
exports.useResource = createInjectDecorator(symbols.INJECTORS.RESOURCE);
exports.useComponent = createInjectDecorator(symbols.INJECTORS.COMPONENT);
exports.Config = createInjectDecorator('config');
exports.App = createInjectDecorator('app');
exports.Messenger = createInjectDecorator('messenger');
