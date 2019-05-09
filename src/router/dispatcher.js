const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mime = require('mime-types');
const Container = require('../container');
const Response = require('../response');
const ResponseFactory = require('../response/manager');
const BaseController = require('../base/controller');
const NotFoundHttpError = require('../errors/not-found-http-error');
// const Pipeline = require('../pipeline');

function type(file, ext) {
  return ext !== '' ? path.extname(path.basename(file, ext)) : path.extname(file);
}

const defaultPublicOptions = {
  maxage: 0,
  gzip: true,
  br: true,
};


class Dispatcher {
  constructor(request, route) {
    this.app = Container.get('app');
    this.request = request;
    this.route = route;
    this.publicOptions = {
      ...defaultPublicOptions,
      ...this.app.get('config').get('app.public', {}),
    };
  }

  /**
   * resolve dispatcher
   * @param {Request} request
   */
  async resolve() {
    if (this.route) {
      return this.route.middleware.handle(this.request, this.dispatchToController.bind(this));
    }
    return this.dispatchToStaticServer();
  }

  /**
   * dispatch request to static server
   */
  async dispatchToStaticServer() {
    // create response instance
    const response = new Response();
    const { maxage } = this.publicOptions;
    if (this.isStaticServerRequest()) {
      let filePath = this.getStaticFilePath();

      let encodingExt = '';
      if (this.isEncodingBR()) {
        filePath += '.br';
        response.setHeader('Content-Encoding', 'br');
        this.request.res.removeHeader('Content-Length');
        encodingExt = '.br';
      } else if (this.isEncodingGZ()) {
        filePath += '.gz';
        response.setHeader('Content-Encoding', 'gzip');
        this.request.res.removeHeader('Content-Length');
        encodingExt = '.gz';
      }

      let stats;
      try {
        stats = await promisify(fs.stat)(filePath);
      } catch (err) {
        if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
          throw this.createNotFountError();
        }
        throw err;
      }
      if (!stats.isDirectory()) {
        response.setHeader('Content-Length', stats.size);
        if (!this.request.getHeader('Last-Modified')) response.setHeader('Last-Modified', stats.mtime.toUTCString());
        if (!this.request.getHeader('Cache-Control')) {
          const directives = [`max-age=${maxage / 1000 | 0}`];
          response.setHeader('Cache-Control', directives.join(','));
        }
        response.setHeader('Content-Type', mime.lookup(type(filePath, encodingExt)));
        response.setData(fs.createReadStream(filePath));
        return (new ResponseFactory(response)).output(this.request);
      }
    }
    throw this.createNotFountError();
  }

  /**
   * check if support br encoding
   * @param {String} filePath
   */
  isEncodingBR(filePath) {
    return this.publicOptions.br && this.request.acceptsEncodings('br', 'identity') === 'br' && fs.existsSync(`${filePath}.br`);
  }

  /**
   * check if support gzip encoding
   * @param {String} filePath
   */
  isEncodingGZ(filePath) {
    return this.publicOptions.gzip && this.request.acceptsEncodings('gzip', 'identity') === 'gzip' && fs.existsSync(`${filePath}.gz`);
  }

  /**
   * return the static server file path
   */
  getStaticFilePath() {
    const requestPath = this.request.path;
    const filePath = decodeURIComponent(requestPath.substr(path.parse(requestPath).root.length));
    return path.resolve(this.app.publicPath, filePath);
  }

  /**
   * check if the request is support static server
   */
  isStaticServerRequest() {
    return this.request.isHead() || this.request.isGet();
  }

  /**
   * dispatch request to controller
   */
  async dispatchToController() {
    const controller = this.app.get(this.route.controller, [this.request], [this.request]);
    const proxyController = this.combineBaseController(controller);
    const { action } = this.route;
    const routeParams = this.route.getParams(this.request.path);
    const result = await proxyController[action](...routeParams);
    return (new ResponseFactory(result)).output(this.request);
  }

  createNotFountError() {
    return new NotFoundHttpError('Not Found');
  }

  combineBaseController(controller) {
    const baseController = new BaseController(this.request);
    return new Proxy(controller, {
      get(target, p, receiver) {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p, receiver);
        }
        return Reflect.get(baseController, p);
      },
    });
  }
}

module.exports = Dispatcher;
