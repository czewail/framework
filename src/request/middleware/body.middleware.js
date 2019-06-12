const buddy = require('co-body');
const formidable = require('formidable');

function parseForm(req, opts = {}) {
  return new Promise(((resolve, reject) => {
    const fields = {};
    const files = {};
    const form = new formidable.IncomingForm(opts);
    form.on('end', () => resolve({
      fields,
      files,
    })).on('error', err => reject(err)).on('field', (field, value) => {
      if (fields[field]) {
        if (Array.isArray(fields[field])) {
          fields[field].push(value);
        } else {
          fields[field] = [fields[field], value];
        }
      } else {
        fields[field] = value;
      }
    }).on('file', (field, file) => {
      if (files[field]) {
        if (Array.isArray(files[field])) {
          files[field].push(file);
        } else {
          files[field] = [files[field], file];
        }
      } else {
        files[field] = file;
      }
    });
    form.parse(req);
  }));
}

module.exports = function Body() {
  return async function bodyParse(request, next) {
    let body = {};
    if (request.is('json')) {
      body = await buddy.json(request.req);
    } else if (request.is('urlencoded')) {
      body = await buddy.form(request.req);
    } else if (request.is('text')) {
      body = await buddy.text(request.req);
    } else if (request.is('multipart')) {
      body = await parseForm(request.req);
    }
    request.req.body = body;
    return next();
  };
};
