'use strict'

class RegExpError extends Error {
  constructor({
    actual,
    expected,
    env
  }) {
    const post = `Expected "${actual}" to match ${expected}`
    super(`Invalid ENV VAR (${env}) - ${post}`)
    this.expected = expected
    this.actual = actual
    this.env = env
    Error.captureStackTrace(this, this.constructor)
  }

  get name() {
    return 'RegExpError'
  }
}

module.exports = RegExpError
