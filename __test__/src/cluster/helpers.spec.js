const os = require('os');
const cluster = require('cluster');
const { parseOpts, isAliveWorker } = require('../../../src/cluster/helpers');
const { WORKER_DYING } = require('../../../src/cluster/const');

describe('Cluster#helpers', () => {
  it('should set default cpus when no workers', () => {
    const options1 = {
      workers: 1,
    };
    expect(parseOpts(options1)).toEqual({
      workers: 1,
    });
    const options2 = {
      workers: 0,
    };
    expect(parseOpts(options2)).toEqual({
      workers: os.cpus().length,
    });
    const options3 = {};
    expect(parseOpts(options3)).toEqual({
      workers: os.cpus().length,
    });
  });

  describe('isAliveWorker', () => {
    it('should return worker alivable by isAliveWorker', () => {
      if (cluster.isMaster) {
        const worker = cluster.fork();
        expect(isAliveWorker(worker)).toBeTruthy();
        worker.process.kill();
      }
    });

    it('should return false by isAliveWorker when disconnect', (done) => {
      if (cluster.isMaster) {
        const worker = cluster.fork();
        worker.on('disconnect', () => {
          expect(isAliveWorker(worker)).toBeFalsy();
          worker.process.kill();
          done();
        });
        worker.disconnect();
      }
    });

    it('should return worker alivable by isAliveWorke when kill', (done) => {
      const worker = cluster.fork();
      worker.on('exit', () => {
        expect(isAliveWorker(worker)).toBeFalsy();
        done();
      });
      worker.process.kill();
    });

    it('should return false when dying', () => {
      const worker = cluster.fork();
      worker[WORKER_DYING] = true;
      expect(isAliveWorker(worker)).toBeFalsy();
      worker.process.kill();
    });
  });
});
