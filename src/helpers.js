
const Container = require('./container');
const Response = require('./response');
const Redirect = require('./response/redirect');
const View = require('./view');
const Cookie = require('./cookie');

if (!Reflect.has(global, 'app')) {
  global.app = function (abstract = 'app', args = [], force = false) {
    return Container.get(abstract, args, force);
  };
}

if (!Reflect.has(global, 'res')) {
  global.res = function (data = null, code = 200, header = {}) {
    return new Response(data, code, header);
  };
}

if (!Reflect.has(global, 'redirect')) {
  global.redirect = function (url = null, code = 302, header = {}) {
    return new Redirect(url, code, header);
  };
}

if (!Reflect.has(global, 'view')) {
  global.view = function (template = '', vars = {}) {
    return new View(template, vars);
  };
}

if (!Reflect.has(global, 'cookie')) {
  global.cookie = function (key, value, options = {}) {
    return new Cookie(key, value, options);
  };
}
