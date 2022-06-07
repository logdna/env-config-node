'use strict'

class EnumError extends Error {
  constructor({
    actual,
    expected,
    env
  }) {
    const post = `Expected "${actual}" to be in [${expected}]`
    super(`Invalid ENV VAR (${env}) - ${post}`)
    this.expected = expected
    this.actual = actual
    this.env = env
    Error.captureStackTrace(this, this.constructor)
  }

  get name() {
    return 'EnumError'
  }
}

module.exports = EnumError
