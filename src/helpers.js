/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Metadata = require('./foundation/support/metadata');

Reflect.getMetadata = function (...params) {
  return Metadata.get(...params);
};
Reflect.setMetadata = function (...params) {
  return Metadata.set(...params);
};
Reflect.hasMetadata = function (...params) {
  return Metadata.has(...params);
};
