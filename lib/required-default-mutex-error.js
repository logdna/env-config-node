'use strict'

module.exports = class RequiredDefaultMutexError extends Error {
  constructor({name, type}) {
    super(`".default()" and ".required()" are mutually exclusive for ENV VAR "${name}"`)
    this.type = type
    Error.captureStackTrace(this, this.constructor)
  }

  get name() {
    return 'RequiredDefaultMutexError'
  }
}
