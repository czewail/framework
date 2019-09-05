/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Cors = require('./cors');
const VerifyCsrfToken = require('./verify-csrf-token');

module.exports = {
  Cors,
  VerifyCsrfToken,
};
