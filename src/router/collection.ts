/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export class RouteCollection {
  /**
   * @var routes
   * {
   *  method: [route]
   * }
   */
  routes: any = {};

  allRoutes: any[] = [];

  /**
   * 找个第一个匹配的路由
   * @param request
   */
  match(request: any) {
    const methodRoutes = this.getMethodRoutes(request.method);
    const machedRoutes = this.getMatchedRoutes(methodRoutes, request.path);
    if (machedRoutes.length > 0) return machedRoutes[0];
    return null;
  }

  getMatchedRoutes(methodRoutes: any[], pathname: string) {
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
   * @param method
   */
  getMethodRoutes(method: string = '') {
    return method ? (this.routes[method] || []) : this.allRoutes;
  }

  add(route: any) {
    for (const method of route.methods) {
      if (!this.routes[method]) {
        this.routes[method] = [];
      }
      this.routes[method].push(route);
    }
    this.allRoutes.push(route);
  }
}
