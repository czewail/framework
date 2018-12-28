
const MESSAGES = Symbol('Message#messages')

class Message {
  constructor() {
    /** @type {array} messages */
    this[MESSAGES] = []
    this.pointer = 0
  }

  /**
   * add message
   * @param {string} key message key
   * @param {string} message message content
   */
  add(key, message) {
    if (!key || !message) return this
    this[MESSAGES].push({
      field: key,
      message,
    })
    return this
  }

  /**
   * check messages is empty
   */
  isEmpty() {
    return !this.messages.length
  }

  /**
   * get all messages
   */
  all() {
    return this[MESSAGES].map(m => m.message)
  }

  /**
   * format messages
   */
  format() {
    const res = {}
    for (const msg of this) {
      if (!res[msg.field]) {
        res[msg.field] = []
      }
      res[msg.field].push(msg.message)
    }
    return res
  }

  /**
   * get first message
   */
  first() {
    return this.messages.length > 0 ? this.messages[0].message : null
  }

  /**
   * all messages
   */
  get messages() {
    return this[MESSAGES]
  }

  /**
   * many format messages
   */
  many() {
    return {
      all: this.all(),
      first: this.first(),
      format: this.format(),
    }
  }

  /**
   * Message iterator
   */
  next() {
    const { messages } = this
    if (this.pointer < messages.length) {
      const pointer = this.pointer
      this.pointer++
      return {
        done: false,
        value: messages[pointer]
      }
    }
    return { done: true, value: void 0 }
  }

  /**
   * json message
   */
  toJSON() {
    const res = []
    for (const msg of this) {
      res.push(msg)
    }
    return res
  }

  [Symbol.iterator]() { return this }
}

module.exports = Message
