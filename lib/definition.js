'use strict'

const assert = require('assert')
const has = require('./has.js')
const MissingEnvError = require('./missing-env-error.js')
const {
  TRUE_VALUES,
  FALSE_VALUES
} = require('./boolean-values.js')

const VALID_BOOLEANS = new Set([
  ...Array.from(TRUE_VALUES)
, ...Array.from(FALSE_VALUES)
])

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

const VALID_TYPES = new Set([
  'string'
, 'number'
, 'boolean'
, 'regex'
, 'enum'
])

module.exports = class Definition {
  constructor(type, name) {
    assert(VALID_TYPES.has(type), `Invalid type: "${type}"`)
    this._required = false
    this._type = type
    this._description = null
    this._default = null
    this._env = null
    this._name = null
    this._match = null
    this._min = null
    this._max = null
    this._value = null
    this._values = null
    this._error = null

    this.name(name)
  }

  required() {
    this._required = true
    return this
  }

  desc(str) {
    this._description = str
    return this
  }

  description(str) {
    return this.desc(str)
  }

  name(str) {
    this._name = str
    this._env = str.replace(/-/g, '_').toUpperCase()
    return this
  }

  default(def) {
    this._default = def
    return this
  }

  match(m) {
    assert.strictEqual(this._type, 'regex', '.match() only valid for regex')
    this._match = m
    return this
  }

  min(n) {
    assert.strictEqual(this._type, 'number', '.min() only valid for number')
    this._min = n
    return this
  }

  max(n) {
    assert.strictEqual(this._type, 'number', '.max() only valid for number')
    this._max = n
    return this
  }

  values(n) {
    assert.strictEqual(this._type, 'enum', '.values() is only valid for enum')
    assert.strictEqual(Array.isArray(n), true, 'input must be an array')
    assert.strictEqual(
      n.length > 0
    , true
    , 'input array must contain at least one element'
    )
    this._values = n
    return this
  }

  toJSON() {
    let match = this._match
    if (match && typeof match === 'object') {
      match = match.toString()
    }
    return {
      'name': this._name
    , 'env': this._env
    , 'default': this._default
    , 'description': this._description
    , match
    , 'type': this._type
    , 'required': this._required
    , 'min': this._min
    , 'max': this._max
    }
  }

  _populate() {
    if (!has(process.env, this._env)) {
      if (this._default !== null) {
        this._value = this._default
      }

      if (this._required) {
        this._error = new MissingEnvError({
          type: this._type
        , name: this._env
        })
      }
      return
    }

    this._value = this._transform(process.env[this._env])
  }

  _prevalidate() {
    if (this._error) throw this._error
  }

  validate() {
    this._populate()
    this._prevalidate()
    if (this._type === 'boolean') this._validateBoolean()
    if (this._type === 'number') this._validateNumber()
    if (this._type === 'regex') this._validateRegex()
    if (this._type === 'string') this._validateString()
    if (this._type === 'enum') this._validateEnum()
    return this
  }

  _transform(value) {
    if (this._type === 'boolean') return this._transformBoolean(value)
    if (this._type === 'number') return this._transformNumber(value)
    if (this._type === 'regex') return this._transformRegex(value)
    return this._transformString(value)
  }

  _transformBoolean(value) {
    if (TRUE_VALUES.has(value)) {
      return true
    }

    if (FALSE_VALUES.has(value)) {
      return false
    }

    return undefined
  }

  _transformNumber(value) {
    return +value
  }

  _transformRegex(value) {
    return value
  }

  _transformString(value) {
    return `${value}`
  }

  get _error_prefix() {
    return `Invalid ENV VAR (${this._env}) -`
  }

  _validateBoolean() {
    if (!VALID_BOOLEANS.has(this._value)) {
      const val = process.env[this._env]
      const msg = `${this._error_prefix} Expected boolean, got "${val}"`
      throw new TypeError(msg)
    }
  }

  _validateNumber() {
    const value = process.env[this._env]
    if (Number.isNaN(this._value)) {
      const msg = `${this._error_prefix} Expected number, got "${value}"`
      throw new TypeError(msg)
    }

    if (this._min !== null && this._min > this._value) {
      const msg = `${this._error_prefix} ${this._value} less than ${this._min}`
      throw new RangeError(msg)
    }

    if (this._max !== null && this._max < this._value) {
      const v = this._value
      const msg = `${this._error_prefix} ${v} greater than ${this._max}`
      throw new RangeError(msg)
    }
  }

  _validateRegex() {
    assert(this._match, `Invalid Env Config (${this._name}): Missing .match()`)
    const re = getRegexp(this._match)
    if (!re.test(this._value)) {
      throw new RegExpError({
        expected: re
      , actual: this._value
      , env: this._env
      })
    }
  }

  _validateString() {
    const val = process.env[this._env]

    if (this._required && !val) {
      throw new MissingEnvError({
        type: 'string'
      , name: this._env
      })
    }
  }

  _validateEnum() {
    assert(this._values, `Invalid Env Config (${this._name}): Missing .values()`)

    if (!this._values.includes(this._value)) {
      throw new EnumError({
        expected: this._values
      , actual: this._value
      , env: this._env
      })
    }
  }
}

function getRegexp(match) {
  if (typeof match !== 'string') {
    return match
  }

  if (match.indexOf('/') !== -1) {
    const splits = match.split('/')
    assert.strictEqual(splits.length, 3, `Invalid regex: "${match}"`)
    return new RegExp(splits[1], splits[2])
  }

  return new RegExp(match)
}
