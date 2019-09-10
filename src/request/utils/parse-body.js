/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

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

module.exports = async (request) => {
  let body = {};
  if (request.is('json')) {
    body.fields = await buddy.json(request.req);
  } else if (request.is('urlencoded')) {
    body.fields = await buddy.form(request.req);
  } else if (request.is('text')) {
    body.fields = await buddy.text(request.req);
  } else if (request.is('multipart')) {
    body = await parseForm(request.req);
  }
  return body;
};
