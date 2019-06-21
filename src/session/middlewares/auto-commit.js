module.exports = async (request, next) => {
  const response = await next();
  await request.session().commit(response);
  return response;
};
