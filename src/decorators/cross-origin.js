
// const Cors = function () {
//   return useMiddleware(CorsMiddleware);
// };

// module.exports = {
//   Cors,
// };

const defaultOptions = {
  origin: '*',
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

function injectClass(elementDescriptor, options) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const corses = Reflect.getMetadata('crossOrigin', target.prototype) ?? {};
      for (const element of elementDescriptor.elements) {
        if (element.kind === 'method') {
          if (!corses[element.key]) {
            corses[element.key] = {
              ...defaultOptions,
              ...options,
            };
          }
        }
      }
      Reflect.setMetadata('crossOrigin', corses, target.prototype);
      return target;
    },
  };
}


function injectMethod(elementDescriptor, options) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const corses = Reflect.getMetadata('crossOrigin', target.prototype) ?? {};
      // console.log(elementDescriptor);
      corses[elementDescriptor.key] = {
        ...defaultOptions,
        ...options,
      };
      Reflect.setMetadata('crossOrigin', corses, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, options) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor, options);
  }
  if (elementDescriptor.kind === 'method') {
    return injectMethod(elementDescriptor, options);
  }
  return elementDescriptor;
}

module.exports = function CrossOrigin(options = {}) {
  return elementDescriptor => handle(elementDescriptor, options);
};
