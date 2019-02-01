const Message = require('../../../../src/foundation/support/message')

describe('Message', () => {
  it('Message#add', () => {
    const msgs = new Message()
    msgs.add('username', 'username must')
    msgs.add()
    expect(msgs.messages).toEqual([{
      field: 'username',
      message: 'username must'
    }])
  })

  it('Message#isEmpty', () => {
    const msgs = new Message()
    expect(msgs.isEmpty()).toBeTruthy()
    msgs.add('username', 'username must')
    expect(msgs.isEmpty()).toBeFalsy()
  })

  it('Message#all', () => {
    const msgs = new Message()
    msgs.add('username', 'username must')
    expect(msgs.all()).toEqual(['username must'])
    msgs.add('password', 'password must')
    expect(msgs.all()).toEqual(['username must', 'password must'])
  })

  it('Message#format', () => {
    const msgs = new Message()
    msgs.add('username', 'username must')
    expect(msgs.format()).toEqual({
      username: ['username must']
    })
    msgs.add('password', 'password must')
    expect(msgs.format()).toEqual({
      username: ['username must'],
      password: ['password must']
    })
    msgs.add('password', 'password must be 1 - 100')
    expect(msgs.format()).toEqual({
      username: ['username must'],
      password: ['password must', 'password must be 1 - 100']
    })
  })

  it('Message#first', () => {
    const msgs = new Message()
    expect(msgs.first()).toBeNull()
    msgs.add('username', 'username must')
    msgs.add('password', 'password must')
    expect(msgs.first()).toBe('username must')
  })

  it('Message#many', () => {
    const msgs = new Message()
    msgs.add('username', 'username must')
    msgs.add('password', 'password must')
    expect(msgs.many()).toEqual({
      all: msgs.all(),
      first: msgs.first(),
      format: msgs.format()
    })
  })

  it('Message#iterator', () => {
    const msgs = new Message()
    msgs.add('username', 'username must')
    msgs.add('password', 'password must')
    const keys = []
    for (const msg of msgs) {
      keys.push(msg)
    }
    expect(keys).toEqual(msgs.messages)
  })
})
