
const createContextsDecorator = require('./factory/create-contexts-decorator');
const symbols = require('../symbol');

exports.OriginalReq = exports.Req = createContextsDecorator(symbols.INJECTORS.REQ);
exports.OriginalRes = exports.Res = createContextsDecorator(symbols.INJECTORS.RES);
exports.HttpRequest = createContextsDecorator(symbols.INJECTORS.REQUEST);
exports.HttpQuery = createContextsDecorator(symbols.INJECTORS.QUERY);
exports.HttpParams = createContextsDecorator(symbols.INJECTORS.PARAMS);
exports.HttpHeader = exports.HttpHeaders = createContextsDecorator(symbols.INJECTORS.HEADERS);
exports.HttpBody = createContextsDecorator(symbols.INJECTORS.BODY);
exports.CookieValue = createContextsDecorator('cookie');
exports.SessionValue = createContextsDecorator('session');
exports.Config = createContextsDecorator('config');
exports.App = createContextsDecorator('app');
exports.Messenger = createContextsDecorator('messenger');
exports.UseService = createContextsDecorator(symbols.INJECTORS.SERVICE);
