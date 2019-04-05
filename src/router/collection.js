

class RouteCollection {
  /**
   * @var {object} routes
   * {
   *  method: [route]
   * }
   */
  routes = {};

  allRoutes = [];

  /**
   * 找个第一个匹配的路由
   * @param {*} request
   */
  match(request) {
    const methodRoutes = this.getMethodRoutes(request.method);
    const machedRoutes = this.getMatchedRoutes(methodRoutes, request.path);
    if (machedRoutes.length > 0) return machedRoutes[0];
    throw new Error('not found');
  }

  getMatchedRoutes(methodRoutes, pathname) {
    const metched = [];
    for (const route of methodRoutes) {
      if (route.match(pathname)) {
        metched.push(route);
      }
    }
    return metched;
  }

  /**
   * 获取匹配请求 method 的路由
   * @param {*} method
   */
  getMethodRoutes(method = null) {
    return method ? (this.routes[method] || []) : this.allRoutes;
  }

  add(route) {
    for (const method of route.methods) {
      if (!this.routes[method]) {
        this.routes[method] = [];
      }
      this.routes[method].push(route);
    }
    this.allRoutes.push(route);
  }
}

module.exports = RouteCollection;
