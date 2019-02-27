

class RouteCollection {
  routes = {};

  getMatchedRoutes(path, method) {
    const metched = []
    const methodKey = method.toUpperCase()
    if (this.routes[methodKey]) {
      for (const route of this.routes[methodKey]) {
        if (route.match(path, method)) {
          metched.push(route)
        }
      }
    }
    return metched
  }

  add(route) {
    for (const method of route.methods) {
      if (!this.routes[method]) {
        this.routes[method] = []
      }
      this.routes[method].push(route)
    }
  }
}

module.exports = RouteCollection
