'use strict'

module.exports = class MissingEnvError extends Error {
  constructor({type, name}) {
    super(`Missing required ENV VAR "${name}" of type "${type}"`)
    this.type = type
    Error.captureStackTrace(this, this.constructor)
  }

  get name() {
    return 'MissingEnvError'
  }
}
