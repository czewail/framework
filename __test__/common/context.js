
const Stream = require('stream');

module.exports = function (_req, _res) {
  const socket = new Stream.Duplex();
  const req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, _req);
  const res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, _res);
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  return { req, res };
};
