'use strict'

const TYPE_EXP = /^\[object (.*)\]$/
const toString = Object.prototype.toString

module.exports = function typeOf(value) {
  const parts = TYPE_EXP.exec(toString.call(value))
  return parts[1].toLowerCase()
}
