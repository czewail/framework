/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { promisify } = require('util');
const redis = require('redis');

class RedisSessionStore {
  /**
   * Create Redis Session Store
   * @param {Application} app
   */
  constructor(app) {
    /**
     * @type {Application} app Application instance
     */
    this.app = app;

    /**
     * @type {Object} redisConfig redis connect options
     */
    this.redisConfig = this.getRedisConfigure();
  }

  /**
   * get database-redis config
   */
  getRedisConfigure() {
    const config = this.app.get('config');
    const redisDatabaseConfig = config.get('database.redis', {});
    const connectionName = config.get('session.connection', '');
    return redisDatabaseConfig[connectionName] || {};
  }

  /**
   * redis client getter
   */
  get client() {
    if (!this._client) {
      this._client = redis.createClient(this.redisConfig);
    }
    return this._client;
  }

  /**
   * get value
   * @param {String} id redis key
   */
  async get(id) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const res = await getAsync(id);
    if (!res) return null;
    return JSON.parse(res);
  }

  /**
   * set value
   * @param {String} id redis key
   * @param {String} sess redis value
   * @param {Number} maxAge redis max age
   */
  async set(id, sess, maxAge) {
    const max = typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24;
    const val = JSON.stringify(sess);
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(id, val, 'PX', max);
  }

  /**
   * destroy key-value
   * @param {String} id redis key
   */
  async destroy(id) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(id);
  }
}

module.exports = RedisSessionStore;
