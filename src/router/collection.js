

class RouteCollection {
  routes = [];

  getMatchedRoutes(path, method) {
    const metched = []
    for (const route of this.routes) {
      if (route.match(path, method)) {
        metched.push(route)
      }
    }
    return metched
  }
}

module.exports = RouteCollection
