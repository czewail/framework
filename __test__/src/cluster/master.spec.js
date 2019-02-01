const { spawn } = require('child_process')
const path = require('path')

function masterPromise(options) {
  return new Promise((resolve, reject) => {
    const masterProcess = spawn('node', [path.join(__dirname, './script/master.js'), JSON.stringify(options)])
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

describe('Cluster Master', () => {
  it('Cluster Master#forkWorker', async () => {
    expect.assertions(2)
    await expect(masterPromise({ workers: 1 })).resolves.toEqual({ workers: 1 })
    await expect(masterPromise({ workers: 2 })).resolves.toEqual({ workers: 2 })
  })
})
