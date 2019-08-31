

exports.createClient = function () {
  return {
    get(key, cb) {
      setTimeout(() => {
        cb(null, '{"test": "aaa"}');
      }, 100);
    },
    set(key, value, type, max, cb) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
    del(key, cb) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
  };
};
