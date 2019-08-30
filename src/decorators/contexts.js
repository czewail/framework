
const createInjectDecorator = require('./factory/create-inject-decorator');
const symbols = require('../symbol');

exports.OriginalReq = exports.Req = createInjectDecorator(symbols.INJECTORS.REQ);
exports.OriginalRes = exports.Res = createInjectDecorator(symbols.INJECTORS.RES);
exports.HttpRequest = createInjectDecorator(symbols.INJECTORS.REQUEST);
exports.HttpResponse = createInjectDecorator(symbols.INJECTORS.RESPONSE);
exports.HttpQuery = createInjectDecorator(symbols.INJECTORS.QUERY);
exports.HttpParams = createInjectDecorator(symbols.INJECTORS.PARAMS);
exports.HttpHeader = exports.HttpHeaders = createInjectDecorator(symbols.INJECTORS.HEADERS);
exports.HttpBody = createInjectDecorator(symbols.INJECTORS.BODY);
exports.CookieValue = createInjectDecorator(symbols.INJECTORS.COOKIE);
exports.SessionValue = createInjectDecorator(symbols.INJECTORS.SESSION);
exports.useService = createInjectDecorator(symbols.INJECTORS.SERVICE);
exports.useValidator = createInjectDecorator(symbols.INJECTORS.VALIDATOR);
exports.useResource = createInjectDecorator(symbols.INJECTORS.RESOURCE);
exports.useComponent = createInjectDecorator(symbols.INJECTORS.COMPONENT);
exports.Config = createInjectDecorator('config');
exports.App = createInjectDecorator('app');
exports.Messenger = createInjectDecorator('messenger');
