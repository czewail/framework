
// const Container = require('./container');
// const Response = require('./response');
// const Redirect = require('./response/redirect');
// const View = require('./view');
// const Cookie = require('./cookie');
const Metadata = require('./foundation/support/metadata');

// if (!Reflect.has(global, 'app')) {
//   global.app = function app(abstract = 'app', args = [], force = false) {
//     return Container.get(abstract, args, force);
//   };
// }

// if (!Reflect.has(global, 'res')) {
//   global.res = function res(data = null, code = 200, header = {}) {
//     return new Response(data, code, header);
//   };
// }

// if (!Reflect.has(global, 'redirect')) {
//   global.redirect = function redirect(url = null, code = 302, header = {}) {
//     return new Redirect(url, code, header);
//   };
// }

// if (!Reflect.has(global, 'view')) {
//   global.view = function view(template = '', vars = {}) {
//     return new View(template, vars);
//   };
// }

// if (!Reflect.has(global, 'cookie')) {
//   global.cookie = function cookie(key, value, options = {}) {
//     return new Cookie(key, value, options);
//   };
// }

Reflect.getMetadata = function (...params) {
  return Metadata.get(...params);
};
Reflect.setMetadata = function (...params) {
  return Metadata.set(...params);
};
Reflect.hasMetadata = function (...params) {
  return Metadata.has(...params);
};
