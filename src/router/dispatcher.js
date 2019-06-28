const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mime = require('mime-types');
const Container = require('../container');
const Response = require('../response');
const ResponseFactory = require('../response/manager');
// const BaseController = require('../base/controller');
const NotFoundHttpError = require('../errors/not-found-http-error');
const HttpError = require('../errors/http-error');
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
      return this.dispatchToRoute();
    }
    return this.dispatchToStaticServer();
    // let res;
    // if (this.route) {
    //   res = await this.dispatchToRoute();
    // } else {
    //   res = await this.dispatchToStaticServer();
    // }
    // return (new ResponseFactory(res)).output(this.request);
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
        return response;
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
  async dispatchToRoute() {
    // return this.route.middleware
    // .handle(this.request, async request => this.route.resolve(request));
    return this.route.middleware
      .handle(this.request, async request => this.route.resolve(request));
  }

  createNotFountError() {
    return new NotFoundHttpError('Not Found');
  }
}

module.exports = Dispatcher;
