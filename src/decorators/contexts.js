
const createContextsDecorator = require('./factory/create-contexts-decorator');

exports.Request = createContextsDecorator('request');
exports.Req = createContextsDecorator('req');
exports.Response = createContextsDecorator('response');
exports.Res = createContextsDecorator('res');
exports.Cookie = createContextsDecorator('cookie');
exports.Ctx = createContextsDecorator('ctx');
exports.Next = createContextsDecorator('next');
exports.Session = createContextsDecorator('session');
exports.Redirect = createContextsDecorator('redirect');
exports.View = createContextsDecorator('view');
exports.Body = createContextsDecorator('body');
exports.Params = createContextsDecorator('params');
exports.Query = createContextsDecorator('query');
exports.Headers = createContextsDecorator('headers');
exports.Config = createContextsDecorator('config');
exports.App = createContextsDecorator('app');
exports.Messenger = createContextsDecorator('messenger');
exports.Service = createContextsDecorator('service');
exports.Axios = createContextsDecorator('axios');
