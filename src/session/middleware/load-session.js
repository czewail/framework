/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { Middleware } = require('../../decorators');

@Middleware('dazeLoadSessionMiddleware')
class LoadSessionMiddleware {
  async resolve(request, next) {
    const session = request.session();
    await session.loadSession();
    return next();
  }
}

module.exports = LoadSessionMiddleware;
