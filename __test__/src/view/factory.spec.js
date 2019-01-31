const path = require('path')
const View = require('../../../src/view')
const ViewFactroy = require('../../../src/view/factory')
const Application = require('../../../src/foundation/application')
const context = require('../../helpers/context')
const Session = require('../../../src/session')

const app = new Application(path.resolve(__dirname, '../../'), {
  view: 'views'
})
app.initialize()


describe('View Factory', () => {
  const view = new View('test.njk')
  const viewFactory = new ViewFactroy(view)
  it('View Factory#combineVars', () => {
    const ctx = context()
    expect(viewFactory.view).toBeInstanceOf(View)
    const vars = viewFactory.combineVars(ctx)
    expect(vars.session).toBeInstanceOf(Session)
  })

  it('View Factory#output', () => {
    const ctx = context()
    const html = viewFactory.output(ctx)
    expect(html).toBe('test')
  })
})
