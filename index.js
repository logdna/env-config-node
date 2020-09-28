'use strict'

const Definition = require('./lib/definition.js')

module.exports = class Env extends Map {
  constructor(input) {
    super()

    if (!Array.isArray(input)) {
      throw new TypeError('input must be an array')
    }

    this.rules = new Map()
    this.validators = input
    this._loadRules()
  }

  static string(name) {
    return new Definition('string', name)
  }

  static number(name) {
    return new Definition('number', name)
  }

  static boolean(name) {
    return new Definition('boolean', name)
  }

  static regex(name) {
    return new Definition('regex', name)
  }

  static enum(name) {
    return new Definition('enum', name)
  }

  _loadRules() {
    for (const rule of this.validators) {
      this._addRule(rule)
    }
  }

  toJSON() {
    const out = Object.create(null)
    for (const obj of this.entries()) {
      out[obj[0]] = obj[1]
    }

    return out
  }

  validateEnvVars() {
    for (const rule of this.rules.values()) {
      rule.validate()
    }
  }

  _addRule(rule) {
    if (this.has(rule._name)) {
      throw new Error(`Rule with name "${rule._name}" already exists`)
    }

    rule._populate()

    this.set(rule._name, rule._value)
    this.rules.set(rule._name, rule)
    return this
  }
}

