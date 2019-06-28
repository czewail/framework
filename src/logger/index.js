const winston = require('winston');
require('winston-mongodb');
require('winston-daily-rotate-file');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Logger {
  constructor() {
    /**
     * @var {Application} daze Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Container} container winston container instance
     */
    this.container = new winston.Container();

    /**
      * @var {Logger} logger log instance
      */
    this.logger = null;

    /**
     * @var {Map} defaultDrivers
     * default transports supported
     */
    this.defaultDrivers = new Map([
      ['console', winston.transports.Console],
      ['file', winston.transports.File],
      ['http', winston.transports.Http],
      ['stream', winston.transports.Stream],
      ['mongodb', winston.transports.MongoDB],
      ['dailyFile', winston.transports.DailyRotateFile],
    ]);

    /**
      * @var {Map} customDrivers
      * custom transports supported
      */
    this.customDrivers = new Map();

    /**
     * @var {Function} defaultFormat default format
     */
    this.defaultFormat = format => format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.splat(),
      format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] - ${info.message}`),
    );
  }

  /**
   * resolve default channel
   */
  resolveDefaultChannel() {
    const defaultChannelName = this.getDefaultChannelName();
    this.resolve(defaultChannelName);
  }

  /**
   * check the default driver is supported
   * @param {string} defaultDriverName driver name
   * @private
   */
  isDefaultDriverSupported(defaultDriverName) {
    return this.defaultDrivers.has(defaultDriverName);
  }

  /**
   * check the custom driver is supported
   * @param {string} customDriverName driver name
   * @private
   */
  isCustomDriverSupported(customDriverName) {
    return this.customDrivers.has(customDriverName);
  }

  /**
   * change log channel
   * @param {string} channelName channel name
   * @public
   */
  channel(channelName) {
    this.resolve(channelName);
    return this;
  }

  /**
   * resolve channel with container
   * @param {string} channelName channel name
   * @private
   */
  resolve(channelName) {
    if (!this.container.has(channelName)) {
      const formatCall = this.getFormat(channelName);
      this.container.add(channelName, {
        transports: this.getTransports(channelName),
        format: formatCall(winston.format),
        levels: this.getLevels(),
        level: this.getLevel(),
      });
    }
    this.logger = this.container.get(channelName);
  }

  /**
   * get winston transports
   * @param {string} channelName channel
   * @private
   */
  getTransports(channelName) {
    const config = this.getChannelConfigure(channelName);
    if (!config) throw new IllegalArgumentError(`Logger channel [${channelName}] is not defined.`);
    const { driver: driverName } = config;

    if (this.isComposeChannel(config)) {
      return this.composeDriverCreator(config);
    }

    if (this.isCustomDriverSupported(driverName)) {
      return this.callCustomDriverCreator(config);
    }

    if (this.isDefaultDriverSupported(driverName)) {
      const driverCreator = this[`${driverName}DriverCreator`];
      return driverCreator(config);
    }

    throw new IllegalArgumentError(`Logger Driver [${driverName}] is not supported.`);
  }

  getFormat(channelName) {
    const topFormat = this.app.get('config').get('logger.format');
    const channelFormat = this.app.get('config').get(`logger.channels.${channelName}.format`);
    return channelFormat || topFormat || this.defaultFormat;
  }

  getLevels() {
    return this.app.get('config').get('logger.levels');
  }

  getLevel() {
    return this.app.get('config').get('logger.level', 'info');
  }

  /**
   * get channel configure
   * @param {string} channelName channel name
   * @private
   */
  getChannelConfigure(channelName) {
    return this.app.get('config').get(`logger.channels.${channelName}`);
  }

  /**
   * get the default channel name
   */
  getDefaultChannelName() {
    return this.app.get('config').get('logger.default', 'console');
  }

  /**
   * check the channel is compose
   * @param {object} channel channel config
   */
  isComposeChannel(channel) {
    const { driver } = channel;
    return driver === 'compose';
  }

  callCustomDriverCreator() {
    // TODO
  }

  /**
   * compose driver creator
   * @param {object} channel channel configure
   */
  composeDriverCreator(channel) {
    const { channels } = channel;
    if (!this.isComposeChannel(channel)) return;
    let res = [];
    for (const _channel of channels) {
      const transports = this.getTransports(_channel);
      res = res.concat(transports);
    }
    return res;
  }

  /**
   * console driver creator
   * @param {object} options channel configure
   */
  consoleDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Console(restOpts)];
  }

  /**
   * dailyFile driver creator
   * @param {object} options channel configure
   */
  dailyFileDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.DailyRotateFile(restOpts)];
  }

  /**
   * file driver creator
   * @param {object} options channel configure
   */
  fileDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.File(restOpts)];
  }

  /**
   * http driver creator
   * @param {object} options channel configure
   */
  httpDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Http(restOpts)];
  }

  /**
   * stream driver creator
   * @param {object} options channel configure
   */
  streamDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Stream(restOpts)];
  }

  /**
   * mongodb driver creator
   * @param {object} options channel configure
   */
  mongodbDriverCreator(options) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.MongoDB(restOpts)];
  }
}

const LoggerProxy = new Proxy(Logger, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended);
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop];
        }
        return t.logger[prop];
      },
    });
  },
});

module.exports = LoggerProxy;
