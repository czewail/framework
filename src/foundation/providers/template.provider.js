const nunjucks = require('nunjucks');
const path = require('path');

class TemplateProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Config Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app;
    this.config = app.get('config');
  }

  /**
   * Provider register Hook
   */
  register() {
    const templateEnv = new nunjucks.Environment([new nunjucks.FileSystemLoader(this.app.viewPath, {
      noCache: this.app.isDebug,
      watch: this.app.isDebug,
    }), new nunjucks.FileSystemLoader(path.resolve(__dirname, '../../errors/views'), {
      noCache: this.app.isDebug,
      watch: this.app.isDebug,
    })], {
      autoescape: false,
    });
    templateEnv.addGlobal('app', this.app);
    templateEnv.addGlobal('config', this.config);
    templateEnv.addGlobal('__public__', this.config.get('app.public_prefix', ''));
    this.app.singleton('template', templateEnv);
  }
}

module.exports = TemplateProvider;
