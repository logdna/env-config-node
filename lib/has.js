'use strict'

module.exports = function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
