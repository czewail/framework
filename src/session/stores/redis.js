const { promisify } = require('util');
const redis = require('redis');

module.exports = function (options) {
  const client = redis.createClient(options);
  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);
  const delAsync = promisify(client.del).bind(client);
  return class {
    static async get(key) {
      const res = await getAsync(key);
      if (!res) return null;
      return JSON.parse(res);
    }

    static async set(key, sess, maxAge) {
      const max = typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24;
      const val = JSON.stringify(sess);
      await setAsync(key, val, 'PX', max);
    }

    static async destroy(key) {
      await delAsync(key);
    }
  };
};
