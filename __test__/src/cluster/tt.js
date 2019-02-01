const path = require('path')
const { spawn } = require('child_process')

function masterPromise(fileName, options) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, './script', fileName)
    const masterProcess = spawn('node', [scriptPath, JSON.stringify(options)])
    masterProcess.stdout.on('data', (buf) => {
      try {
        const json = JSON.parse(buf.toString('utf-8'))
        masterProcess.kill(1)
        resolve(json)
      } catch (e) {
        masterProcess.kill(1)
        reject(new Error({
          message: buf.toString('utf-8')
        }))
      }
    })
  })
}

masterPromise('master', { workers: 1 }).then(() => {
  console.log(111111111)
})
