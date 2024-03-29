'use strict'

const assert = require('assert')
const has = require('./has.js')
const typeOf = require('./type-of.js')
const {
  TRUE_VALUES,
  FALSE_VALUES
} = require('./boolean-values.js')
const {
  EnumError
, ListError
, MissingEnvError
, RegExpError
, RequiredDefaultMutexError
} = require('./error-types/index.js')

const VALID_BOOLEANS = new Set([
  ...Array.from(TRUE_VALUES)
, ...Array.from(FALSE_VALUES)
])

const EMPTY_STRING = ''

const SEP_TYPES = new Set([
  'string'
, 'regexp'
])

const LIST_TYPES = new Set([
  'string'
, 'number'
, 'boolean'
])

const VALID_TYPES = new Set([
  ...LIST_TYPES
, 'list'
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
    this._list_separator = /\s+|,/
    this._list_type = null
    this._value = null
    this._values = null
    this._allow_empty = false

    this.name(name)
  }

  allowEmpty() {
    this._allow_empty = true
    return this
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
    const is_number = (this._type === 'number' || this._list_type === 'number')
    assert(is_number, '.min() only valid for number')
    this._min = n
    return this
  }

  max(n) {
    const is_number = (this._type === 'number' || this._list_type === 'number')
    assert(is_number, '.max() only valid for number')
    this._max = n
    return this
  }

  separator(val) {
    assert.strictEqual(this._type, 'list', '.separator() only valid for list')
    const type = typeOf(val)
    assert(SEP_TYPES.has(type), 'Invalid list separator. Must be string or regex')
    this._list_separator = val
    return this
  }

  type(type) {
    assert.strictEqual(this._type, 'list', '.type() only valid for list')
    assert(LIST_TYPES.has(type), `Invalid List type: "${type}"`)
    this._list_type = type
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
    , 'list_type': this._list_type
    , 'separator': this._list_separator
    , 'allow_empty': this._allow_empty
    }
  }

  _populate() {
    const value_is_missing = !has(process.env, this._env)
      || process.env[this._env] === EMPTY_STRING

    if (value_is_missing) {
      if (this._default !== null && !this._allow_empty) {
        this._value = this._transform(this._default)
        return
      }
    }

    this._value = this._transform(process.env[this._env])
  }

  _prevalidate() {
    if (this._required && this._default !== null) {
      const err = new RequiredDefaultMutexError({
        type: this._type
      , name: this._env
      })
      throw err
    }
    if (this._required) {
      const value_is_missing = !has(process.env, this._env)
        || process.env[this._env] === EMPTY_STRING

      if (value_is_missing) {
        const err = new MissingEnvError({
          type: this._type
        , name: this._env
        })
        throw err
      }
    }
  }

  validate() {
    this._prevalidate()
    this._populate()
    if (this._type === 'boolean') this._validateBoolean()
    if (this._type === 'number') this._validateNumber()
    if (this._type === 'regex') this._validateRegex()
    if (this._type === 'list') this._validateList()
    if (this._type === 'enum') this._validateEnum()
    return this
  }

  _transform(value) {
    if (this._type === 'boolean') return this._transformBoolean(value)
    if (this._type === 'number') return this._transformNumber(value)
    if (this._type === 'regex') return this._transformRegex(value)
    if (this._type === 'list') return this._transformList(value)
    return this._transformString(value)
  }

  _transformBoolean(value) {
    if (value === EMPTY_STRING && this._allow_empty) {
      // Because of .default() and .allowEmpty() handling '' is a special case since ''
      // cannot be a valid falsey value, or it would conflict with those other features.
      value = false
    }
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
    if (value === undefined || value === null) return null
    return `${value}`
  }

  _transformList(value) {
    if (value === undefined || value === null) return null
    assert(this._list_type, `Invalid Env Config (${this._name}): Missing .type()`)
    const type = this._list_type.charAt(0).toUpperCase() + this._list_type.slice(1)
    const method = `_transform${type}`
    const fn = this[method].bind(this)
    const list = Array.isArray(value)
      ? value
      // This ensures that our lists are strings. Therefore, there's no string "validation"
      : String(value).split(this._list_separator).filter(Boolean)

    return list.map(fn)
  }

  get _error_prefix() {
    return `Invalid ENV VAR (${this._env}) -`
  }

  _validateBoolean(...args) {
    const input = args.length ? args[0] : this._value
    if (!VALID_BOOLEANS.has(input)) {
      const val = process.env[this._env]
      const msg = `${this._error_prefix} Expected boolean, got "${val}"`
      throw new TypeError(msg)
    }
  }

  _validateNumber(...args) {
    const input = args.length ? args[0] : this._value
    const value = process.env[this._env]
    if (Number.isNaN(input)) {
      const msg = `${this._error_prefix} Expected number, got "${value}"`
      throw new TypeError(msg)
    }

    if (this._min !== null && this._min > input) {
      const reason = `${input} less than ${this._min}`
      const msg = `${this._error_prefix} ${reason}`
      const err = new RangeError(msg)
      err.reason = reason
      throw err
    }

    if (this._max !== null && this._max < input) {
      const v = input
      const reason = `${v} greater than ${this._max}`
      const msg = `${this._error_prefix} ${reason}`
      const err = new RangeError(msg)
      err.reason = reason
      throw err
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

  _validateList() {
    assert(this._list_type, `Invalid Env Config (${this._name}): Missing .type()`)
    if (!Array.isArray(this._value)) return

    if (this._required && !this._value.length) {
      throw new MissingEnvError({
        type: this._type
      , name: this._env
      })
    }

    const type = this._list_type.charAt(0).toUpperCase() + this._list_type.slice(1)
    const method = `_validate${type}`
    if (!this[method]) return
    const fn = this[method].bind(this)

    for (const value of this._value) {
      try {
        fn.call(this, value)
      } catch (err) {
        throw new ListError({
          actual: value
        , original: process.env[this._env]
        , input: this._value.join()
        , type: this._list_type
        , env: this._env
        , reason: err.reason
        })
      }
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
