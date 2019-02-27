
const http = require('http')

class HttpServer extends http.Server {
  // listen(...args) {
  //   // const server = http.createServer((req, res) => {
  //   //   const middleware = this.compose()
  //   //   return this.handleRequest(req, res, middleware)
  //   // })
  //   const server = 
  //   return server.listen(...args)
  // }

  handleRequest(req, res, middleware) {
    return middleware(req, res)
  }
}

module.exports = HttpServer
