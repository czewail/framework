

/**
 * match trie node with type
 */
exports.isMatchNodeWithType = function (node, key) {
  if (node.type === 'static') {
    return node.key === key;
  }
  if (node.type === 'reg') {
    return (new RegExp(node.key).test(key));
  }
  return false;
};

/**
 * parse pattern to array
 */
exports.parsePattern = function (pattern) {
  return pattern.split('/').filter(p => p !== '');
};
