'use strict'

class ListError extends Error {
  constructor(opts) {
    const {type, env, actual, input, original, reason} = opts
    const extra = reason || `Value ${actual} is not of type ${type}`
    super(`Invalid value in List ENV VAR ${env} - ${extra} (${input})`)
    this.type = type
    this.env = env
    this.actual = String(actual)
    this.original = original
    this.input = input
    Error.captureStackTrace(this, this.constructor)
  }

  get name() {
    return 'ListError'
  }
}

module.exports = ListError
