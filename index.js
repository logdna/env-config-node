'use strict'

const util = require('util')
const Definition = require('./lib/definition.js')

// Exported below; defined as a named class so we can augment prototype safely
class Config extends Map {
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

  static list(name) {
    return new Definition('list', name)
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
      // After validation, refresh the stored value in case rule mutated (_value)
      this.set(rule._name, rule._value)
    }
  }

  _addRule(rule) {
    if (this.has(rule._name)) {
      throw new Error(`Rule with name "${rule._name}" already exists`)
    }

    rule._populate()

    this.set(rule._name, rule._value)
    this.rules.set(rule._name, rule)

    // Expose each rule as an enumerable getter property for REPL / plain JS autocomplete
    if (!Object.prototype.hasOwnProperty.call(this, rule._name)) {
      Object.defineProperty(this, rule._name, {
        enumerable: true
      , configurable: true
      , get: function() {
          return this.get(rule._name)
        }
      })
    }
    return this
  }
}

// Friendly REPL / console inspection (shows plain object of key/value pairs)
Config.prototype[util.inspect.custom] = function() {
  return this.toJSON()
}

/**
 * NOTE: The TypeScript declaration file (index.d.ts) supplies the rich generic
 * types. These JSDoc typedefs and helper simply help JS-only consumers get autocomplete
 * without enabling TypeScript compilation.
 */

/**
 * Factory helper for JS users wanting stronger inference through JSDoc.
 *
 * The TypeScript declaration file (index.d.ts) supplies rich generic types.
 * These JSDoc typedefs and helper simply help JS-only consumers get autocomplete
 * without enabling TypeScript compilation.
 *
 * @template {readonly any[]} Defs
 * @param {Defs} defs
 * @returns {Config} (Generic mapping refined by the .d.ts file)
 */
function createConfig(defs) {
  return new Config(defs)
}

// Attach factory to class & exports
Config.createConfig = createConfig

module.exports = Config
module.exports.createConfig = createConfig

