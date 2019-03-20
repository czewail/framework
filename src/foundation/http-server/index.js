const http = require('http')
const Container = require('../../container')

class HttpServer {
  app = Container.get('app');

  listen(...args) {
    const server = http.createServer((req, res) => {
      // Simple Merge
      const ctx = {
        req, res
      }
      return this.app.get('context').process(ctx).catch(err => {
        console.log(err, 'err')
      })
    })
    return server.listen(...args)
  }
}

module.exports = HttpServer
