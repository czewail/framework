
const { isMatchNodeWithType } = require('./helpers');

class Node {
  constructor(key, type) {
    /**
     * @type {string} node key: part of request path
     */
    this.key = key;

    /**
     * @type {string} static | reg
     */
    this.type = type;

    /**
     * @type {array} child node alist
     */
    this.children = [];

    /**
     * binded route
     */
    this.route = null;
  }

  /**
   * get first mached route
   * @param {string} key node key
   */
  matchChild(key) {
    for (const child of this.children) {
      if (isMatchNodeWithType(child, key)) {
        return child;
      }
    }
    return null;
  }

  /**
   * get all macthed route
   * @param {string} key node key
   */
  matchChildren(key) {
    const nodes = [];
    for (const child of this.children) {
      if (isMatchNodeWithType(child, key)) {
        nodes.push(child);
      }
    }
    return nodes;
  }

  /**
   * insert a node with route
   * @param {Route} route route instance
   * @param {array} pieces path parts obj: has type and key porps
   * @param {number} height parts index
   */
  insert(route, pieces = [], height = 0) {
    if (pieces.length === height) {
      this.route = route;
      return;
    }

    const keyObj = pieces[height];

    let child = this.matchChild(keyObj.key);

    if (!child) {
      child = new Node(keyObj.key, keyObj.type);
      this.children.push(child);
    }
    child.insert(route, pieces, height + 1);
  }

  /**
   * search macthed node
   * @param {array} keys path parts
   * @param {number} height
   */
  search(keys = [], height = 0) {
    if (keys.length === height) {
      if (!this.route) return null;
      return this;
    }

    const key = keys[height];
    const children = this.matchChildren(key);

    for (const child of children) {
      const res = child.search(keys, height + 1);
      if (res) return res;
    }
    return null;
  }
}

module.exports = Node;
