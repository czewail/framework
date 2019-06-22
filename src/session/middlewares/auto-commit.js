const is = require('core-util-is');
const symbols = require('../../symbol');

module.exports = async (request, next) => {
  const flashed = request.session().get(symbols.SESSION.FLASHED);
  const flashs = request.session().get(symbols.SESSION.FLASHS);
  if (flashed === true && is.isArray(flashs)) {
    for (const flash of flashs) {
      request.session().remove(flash);
    }
    request.session().set(symbols.SESSION.FLASHS, []);
  }
  if (flashed === false) {
    request.session().set(symbols.SESSION.FLASHED, true);
  }
  const response = await next();
  await request.session().commit(response);
  return response;
};
