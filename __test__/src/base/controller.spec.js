require('../../../src/helpers');
require('../../daze/src/app/controller/example');
require('../../daze/src/provider/app');
const path = require('path');
const Controller = require('../../../src/base/controller');
const Application = require('../../../src/foundation/application');
const View = require('../../../src/view');

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Base Controller Class', () => {
  it('should return request instance with request getter', () => {
    const request = {};
    app.bind(Controller, Controller);
    const controller = app.get(Controller, [request]);
    expect(controller.request).toBe(request);
  });

  it('should return view instance with view method', () => {
    app.bind(Controller, Controller);
    const controller = app.get(Controller);
    expect(controller.view()).toBeInstanceOf(View);
  });

  it('should return view instance and set view assigns with assign method', () => {
    app.bind(Controller, Controller);
    const controller = app.get(Controller);
    const res = controller.assign('aaa', 'bbb');
    expect(res).toBeInstanceOf(View);
    expect(res.getVars()).toEqual({
      aaa: 'bbb',
    });
  });

  it('should return view instance and set template with render method', () => {
    app.bind(Controller, Controller);
    const controller = app.get(Controller);
    const res = controller.render('aaa.html');
    expect(res).toBeInstanceOf(View);
    expect(res.template).toBe('aaa.html');
  });
});
