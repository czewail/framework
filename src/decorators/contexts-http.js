
const createInjectDecorator = require('./factory/create-inject-decorator');
const symbols = require('../symbol');

exports.OriginalReq = exports.Req = createInjectDecorator(symbols.INJECTORS.REQ);
exports.OriginalRes = exports.Res = createInjectDecorator(symbols.INJECTORS.RES);
exports.Request = createInjectDecorator(symbols.INJECTORS.REQUEST);
exports.Response = createInjectDecorator(symbols.INJECTORS.RESPONSE);
exports.Query = createInjectDecorator(symbols.INJECTORS.QUERY);
exports.Params = createInjectDecorator(symbols.INJECTORS.PARAMS);
exports.Header = exports.Headers = createInjectDecorator(symbols.INJECTORS.HEADERS);
exports.Body = createInjectDecorator(symbols.INJECTORS.BODY);
exports.CookieValue = createInjectDecorator(symbols.INJECTORS.COOKIE);
exports.SessionValue = createInjectDecorator(symbols.INJECTORS.SESSION);
