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
