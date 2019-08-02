const is = require('core-util-is');
const symbols = require('../../symbol');

module.exports = (request, next) => {
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
  request.session().set(symbols.SESSION.PREVIOUS, request.session().get(symbols.SESSION.CURRENT) || '');
  request.session().set(symbols.SESSION.CURRENT, request.url);

  console.log(request.session().session, flashed, flashs, '===flashmiddleware');

  return next();
};
