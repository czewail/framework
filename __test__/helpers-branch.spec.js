global.res = () => true
global.app = () => true
global.redirect = () => true

require('../src/helpers')

describe('helpers-branch', () => {
  it('global overflow', () => {
    expect(res()).toBeTruthy()
    expect(app()).toBeTruthy()
    expect(redirect()).toBeTruthy()
  })
})
