
const { crc32 } = require('crc');

exports.decode = function decode(str) {
  console.log(str, 'str');
  const body = Buffer.from(str, 'base64').toString('utf8');
  console.log(body, 'body');
  const json = JSON.parse(body);
  return json;
};

exports.encode = function encode(body) {
  return Buffer.from(JSON.stringify(body)).toString('base64');
};

exports.hash = function hash(sess) {
  return crc32(JSON.stringify(sess));
};
