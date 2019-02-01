const http = require('http')
const cluster = require('cluster')
const Master = require('../../../../src/cluster/master')

/* eslint no-console: [0] */

const opts = Object.assign({}, JSON.parse(process.argv[2]))
// console.log(opts)

const forkWorkers = function (options) {
  try {
    if (cluster.isMaster) {
      const master = new Master(options)
      try {
        master.forkWorkers().then(() => {
          const workers = []
          for (const key of Object.keys(cluster.workers)) {
            workers.push(cluster.workers[key].id)
          }
          console.log(JSON.stringify({
            workers: workers.length
          }))
        })
      } catch (err) {
        console.log(JSON.stringify({
          message: 'err'
        }))
      }
    } else {
      http.createServer((req, res) => {
        res.writeHead(200)
        res.end('hello\n')
      }).listen(8001)
    }
  } catch (err) {
    console.log('err')
  }
}


forkWorkers(opts)
