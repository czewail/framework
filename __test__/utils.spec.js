const { defer, iterable } = require('../src/utils')

// global.Promise = jest.requireActual('promise')

describe('utils', () => {
  it('utils#defer', async () => {
    const deferred = defer()
    expect(typeof deferred.promise.then === 'function').toBeTruthy()
    expect(typeof deferred.promise.catch === 'function').toBeTruthy()
  })

  it('utils#iterable', () => {
    const arr = []
    const obj = {}
    expect(iterable(arr)).toBeTruthy()
    expect(iterable(obj)).toBeFalsy()
  })
})
