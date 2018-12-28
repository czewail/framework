const { defer, iterable } = require('../src/utils')

describe('utils', () => {
  it('utils#defer', async () => {
    expect.assertions(2)
    const deferred = defer()
    const deferred2 = defer()
    deferred.resolve('done')
    deferred2.reject('err')
    await expect(deferred.promise).resolves.toBe('done')
    await expect(deferred2.promise).rejects.toBe('err')
  })

  it('utils#iterable', () => {
    const arr = []
    const obj = {}
    expect(iterable(arr)).toBeTruthy()
    expect(iterable(obj)).toBeFalsy()
  })
})
