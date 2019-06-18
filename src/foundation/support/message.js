
const MESSAGES = Symbol('Message#messages');

class Message {
  constructor() {
    /**
     * @type {Array} messages
     */
    this[MESSAGES] = [];

    /**
     * @type {Number} iterator pointer
     */
    this.pointer = 0;
  }

  /**
   * add message
   * @param {string} key message key
   * @param {string} message message content
   */
  add(field, message) {
    if (!field || !message) return this;
    this[MESSAGES].push({
      field,
      message,
    });
    return this;
  }

  /**
   * check messages is empty
   */
  isEmpty() {
    return !this.messages.length;
  }

  /**
   * get all messages
   */
  all() {
    return this[MESSAGES].map(m => m.message);
  }

  /**
   * format messages
   */
  format() {
    const res = {};
    for (const msg of this.messages) {
      if (!res[msg.field]) {
        res[msg.field] = [];
      }
      res[msg.field].push(msg.message);
    }
    return res;
  }

  /**
   * get first message
   */
  first() {
    return this.messages.length > 0 ? this.messages[0].message : null;
  }

  /**
   * all messages
   */
  get messages() {
    return this[MESSAGES];
  }

  /**
   * many format messages
   */
  many() {
    return {
      all: this.all(),
      first: this.first(),
      format: this.format(),
    };
  }

  /**
   * Message iterator
   */
  next() {
    const { messages } = this;
    if (this.pointer < messages.length) {
      const { pointer } = this;
      this.pointer = this.pointer + 1;
      return {
        done: false,
        value: messages[pointer],
      };
    }
    return { done: true, value: undefined };
  }

  [Symbol.iterator]() { return this; }
}

module.exports = Message;
