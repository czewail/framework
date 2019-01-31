const path = require('path')
const fs = require('fs')

module.exports = {
  default: 'console',
  channels: {
    compose: {
      driver: 'compose',
      channels: ['console', 'dailyFile'],
    },
    console: {
      driver: 'console',
    },
    console3: {
      driver: 'console3',
    },
    file: {
      driver: 'file',
      filename: path.resolve(__dirname, '../logs')
    },
    http: {
      driver: 'http',
    },
    stream: {
      driver: 'stream',
      stream: fs.createWriteStream('/dev/null')
    },
    dailyFile: {
      driver: 'dailyFile',
      filename: 'common-%DATE%.log',
      dirname: path.resolve(__dirname, '../../logs'),
    },
  },
}
