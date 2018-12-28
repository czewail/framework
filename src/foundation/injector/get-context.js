const { INJECTOR_CONETXT } = require('../../symbol')

const contextsMap = {
  request: INJECTOR_CONETXT.REQUEST,
  response: INJECTOR_CONETXT.RESPONSE,
  cookie: INJECTOR_CONETXT.COOKIE,
  session: INJECTOR_CONETXT.SESSION,
  ctx: INJECTOR_CONETXT.CTX,
  next: INJECTOR_CONETXT.NEXT,
  redirect: INJECTOR_CONETXT.REDIRECT,
  view: INJECTOR_CONETXT.VIEW,
  body: INJECTOR_CONETXT.BODY,
  params: INJECTOR_CONETXT.PARAMS,
  query: INJECTOR_CONETXT.QUERY,
  headers: INJECTOR_CONETXT.HEADERS,
  config: INJECTOR_CONETXT.CONFIG,
  app: INJECTOR_CONETXT.APP,
  messenger: INJECTOR_CONETXT.MESSENGER,
  service: INJECTOR_CONETXT.SERVICE,
  axios: INJECTOR_CONETXT.AXIOS,
}

module.exports = function (type, ctx) {
  const conetxt = ctx ? ctx.injectorContext : this.injectorContext
  if (!contextsMap[type]) return
  return conetxt[contextsMap[type]]
}
