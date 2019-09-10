/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const minimatch = require('minimatch');
const Response = require('../../response');
const { Component } = require('../../decorators');
const Middleware = require('../../base/middleware');

const defaultExcludedMethods = ['HEAD', 'GET', 'OPTIONS'];
const defaultInvalidTokenMessage = 'Invalid CSRF token';

@Component('verify-csrf-token')
class VerifyCsrfToken extends Middleware {
  get except() {
    return [];
  }

  get excludedMethods() {
    return defaultExcludedMethods;
  }

  get invalidTokenMessage() {
    return defaultInvalidTokenMessage;
  }

  isReadVerb(method) {
    const excludedMethods = Array.isArray(this.excludedMethods)
      ? this.excludedMethods
      : defaultExcludedMethods;
    return !!~excludedMethods.indexOf(method.toUpperCase());
  }

  inExcept(requestPath) {
    for (const except of this.except) {
      if (minimatch(requestPath, except)) return true;
    }
    return false;
  }

  tokenValidity(request) {
    const bodyToken = (request.body && typeof request.body._token === 'string')
      ? request.body._token : false;
    const token = bodyToken
      || request.getHeader('csrf-token')
      || request.getHeader('xsrf-token')
      || request.getHeader('x-csrf-token')
      || request.getHeader('x-xsrf-token');

    if (!token) {
      return false;
    }
    if (!this.app.get('csrf').verify(request.session().get('secret'), token)) {
      return false;
    }
    return true;
  }

  resolve(request, next) {
    const session = request.session();
    if (!session.get('secret')) {
      session.set('secret', this.app.get('csrf').secretSync());
    }
    request._csrf = this.app.get('csrf').create(session.get('secret'));
    if (
      this.isReadVerb(request.getMethod())
      || this.inExcept(request.getPath())
      || this.tokenValidity(request)
    ) {
      return next();
    }
    return new Response(this.invalidTokenMessage, 403);
  }
}

module.exports = VerifyCsrfToken;
