const Node = require('./node');
const { parsePattern } = require('./helpers');

class Trie {
  constructor() {
    this.routes = new Map();
  }

  add(route) {
    for (const method of route.methods) {
      if (!this.routes.has(method)) {
        this.routes.set(method, new Node());
      }
      this.register(this.routes.get(method), route);
    }
  }

  register(rootNode, route) {
    rootNode.insert(route, route.pieces, 0);
  }

  match(request) {
    const { method, path } = request;
    const rootNode = this.routes.get(method);
    if (!rootNode) return null;
    const keys = parsePattern(path);
    const result = rootNode.search(keys, 0);
    if (result) return result.route || null;
    return null;
  }
}

module.exports = Trie;
