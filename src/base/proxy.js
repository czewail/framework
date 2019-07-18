
module.exports = (current, Base) => new Proxy(current, {
  construct(target, argArray, newTarget) {
    const instance = Reflect.construct(target, argArray, newTarget);
    const base = new Base(...argArray);
    return new Proxy(instance, {
      get(t, p, receiver) {
        if (Reflect.has(t, p)) {
          return Reflect.get(t, p, receiver);
        }
        return base[p];
      },
    });
  },
});
