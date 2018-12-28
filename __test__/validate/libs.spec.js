const libs = require('../../src/validate/lib')

describe('validate-libs', () => {
  it('validate-libs#accepted', async () => {
    expect(libs.accepted(1)).toBeTruthy()
    expect(libs.accepted('on')).toBeTruthy()
    expect(libs.accepted('yes')).toBeTruthy()
    expect(libs.accepted('1')).toBeTruthy()
    expect(libs.accepted('true')).toBeTruthy()
    expect(libs.accepted(true)).toBeTruthy()
    expect(libs.accepted('no')).toBeFalsy()
    expect(libs.accepted('off')).toBeFalsy()
  })

  it('validate-libs#after', async () => {
    expect(libs.after(new Date(Date.now() + 1000))).toBeTruthy()
    expect(libs.after(new Date(Date.now() - 1000))).toBeFalsy()
    expect(libs.after(String(new Date(Date.now() - 1000)))).toBeFalsy()
    expect(libs.after(String(new Date(Date.now() + 1000)))).toBeTruthy()
  })

  it('validate-libs#alpha', async () => {
    expect(libs.alpha('abcdefg')).toBeTruthy()
    expect(libs.alpha('abcdefg123')).toBeFalsy()
  })

  it('validate-libs#alphanumeric', async () => {
    expect(libs.alphanumeric('abcdefg')).toBeTruthy()
    expect(libs.alphanumeric('abcdefg123')).toBeTruthy()
    expect(libs.alphanumeric('abcdefg123$#')).toBeFalsy()
  })

  it('validate-libs#before', async () => {
    expect(libs.before(new Date(Date.now() + 1000))).toBeFalsy()
    expect(libs.before(new Date(Date.now() - 1000))).toBeTruthy()
    expect(libs.before(String(new Date(Date.now() - 1000)))).toBeTruthy()
    expect(libs.before(String(new Date(Date.now() + 1000)))).toBeFalsy()
  })

  it('validate-libs#contains', async () => {
    const arr = []
    arr.toString = null
    expect(libs.contains('abcdefg', 'abcd')).toBeTruthy()
    expect(libs.contains('abcdefg', 'abcg')).toBeFalsy()
    expect(libs.contains('abcdefg', 111)).toBeFalsy()
    expect(libs.contains(111111, 11111)).toBeTruthy()
    expect(libs.contains(111, null)).toBeFalsy()
    expect(libs.contains(null, null)).toBeFalsy()
    expect(libs.contains(null, arr)).toBeFalsy()
    expect(libs.contains(arr, arr)).toBeFalsy()
  })
})
