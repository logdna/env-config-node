[![Coverage Status](https://coveralls.io/repos/github/logdna/env-config-node/badge.svg?branch=main)](https://coveralls.io/github/logdna/env-config-node?branch=main)

# @logdna/env-config

> Node.js Package to define, document, and assert environment variables

## Install

```
$ npm install --save @logdna/env-config
```

## Test

```
$ npm t
```

## Usage

The recommended way to structure applications with this package is as follows:

```js
// config.js

'use strict'

const Config = require('@logdna/env-config')
const config = new Config([
  Config.string('loglevel').default('info')
, Config.number('port').default(3000)
])

module.exports = config
```

```js
// index.js
//
// The following env vars can be set:
//
// LOGLEVEL - defaults to info
// PORT - default to 3000
//

'use strict'

const http = require('http')
const config = require('./config.js')

// This validates that we have the necessary env vars.
config.validateEnvVars()

http.listen(config.get('port'), () => {
  log.info('listen', config.get('port'))
})
```

Under the hood, `Config` is a [`<Map>`][], so use it like one.

This package also provides a way to automatically generate documentation
for the environment variables for a service.

If the `doc` directory does not exist, it can be created using the following:

```
$ mkdir -p doc
```

Then, add a `generate` script to the
service's `package.json` that looks similar to this:

```sh
config-doc config.js > doc/env.md
```

You should also add a link to this document in the `README.md` of the service.

## API

### `new Config(input)`

* `input` [`<Array>`][] Array of objects that represent a single rule.

Each `input` item should be a `Definition`. See "Static Methods" below.

### Static Methods
---

The following static methods return a `Definition` that can be used.

#### `Config.string(name)`

* `name` [`<String>`][] Name of the config rule. The environment variable
read for this rule will be `name` uppercased with `-` replaced with `_`.

This defines a configuration definition for an environment variable that is
a [`<String>`][].

Returns: `Definition`

#### `Config.number(name)`

* `name` [`<String>`][] Name of the config rule. The environment variable
read for this rule will be `name` uppercased with `-` replaced with `_`.

This defines a configuration defintion for an environment variable that is
a [`<Number>`][].

Returns: `Definition`

#### `Config.boolean(name)`

* `name` [`<String>`][] Name of the config rule. The environment variable
read for this rule will be `name` uppercased with `-` replaced with `_`.

This defines a configuration definition for an environment variable that is
a [`<Boolean>`][].

Returns: `Definition`

#### `Config.regex(name)`

* `name` [`<String>`][] Name of the config rule. The environment variable
read for this rule will be `name` uppercased with `-` replaced with `_`.

This defines a configuration definition for an environment variable that
matches a [`<RegExp>`][].

Returns: `Definition`

#### `Config.enum(name)`

* `name` [`<String>`][] Name of the config rule. The environment variable
read for this rule will be `name` uppercased with `-` replaced with `_`.

A single value will be read from the environment variable as described,
but it must exist in the allowed list of [`.values()`](#definitionvaluesarr).
Every `enum` type needs to implement a `.values()` array.

### Instance Methods
---

#### `Config#toJSON()`

Returns a JSON representation of the config object.
This will only work for Primitive values, objects, and arrays.

#### `Config#validateEnvVars()`

This should be called to validate that the required environment variables
have been passed and that they satisfy the requirements. If any are not passed,
or do not satisfy the requirements, an error will be thrown.

* Throws: [`<TypeError>`][]
  | [`<RangeError>`][]
  | [`<RegExpError>`](#regexperror)
  | [`<MissingEnvError>`](#missingenverror)
  | [`<EnumError>`](#enumerror)

### Definition

This is a private prototype that offers the following methods:

#### `Definition#required()`

Specifies that this env var is required. By default, env vars are optional.

Returns `this` to allow chaining.

#### `Definition#desc(str)`

* `str` [`<String>`][] The description

This sets the description for the env var that will be used for docs.
This is an alias for the `Definition#description(str)` method.

Returns `this` to allow chaining.

#### `Definition#description(str)`

* `str` [`<String>`][] The description

This sets the description for the env var that will be used for docs.

Returns `this` to allow chaining.

#### `Definition#default(def)`

* `def` [`<String>`][] or [`<Number>`][] or [`<Boolean>`][] The default

This sets the default value of the rule. This does not set the actual env
var though.

Returns `this` to allow chaining.

#### `Definition#toJSON()`

Returns a JSON representation of the configuration `Definition`.

#### `Definition#match(re)`

* `re` [`<String>`][] or [`<RegExp>`][] The matching regular expression

This method can only be used with `Config.regex()`. Otherwise, an error will
be thrown.

Returns `this` to allow chaining.

#### `Definition#min(n)`

* `n` [`<Number>`][] The minimum value for the rule

This method can only be used with `Config.number()`. Otherwise, an error will
be thrown.

Returns `this` to allow chaining.

#### `Definition#max(n)`

* `n` [`<Number>`][] The maximum value for the rule

This method can only be used with `Config.number()`. Otherwise, an error will
be thrown.

Returns `this` to allow chaining.

#### `Definition#values(arr)`

* `arr` [`<Array>`][] An array of acceptable values for an `enum` type.

This method can only be used with [`Config.enum()`](#configenumname).
The final value must exist in the values `arr`, or an error is thrown.

## Custom Errors

### `'MissingEnvError'`

* [`<Error>`][]
  * `name` [`<String>`][] Static value of `MissingEnvError`
  * `type` [`<String>`][] Describes the definition: `string`, `number`,
    `boolean`, `regex`, or `enum`

This error is thrown if [`Definition#required`](#definitionrequired) was used,
but no such environment variable or value was discovered.

### `'RegExpError'`

* [`<Error>`][]
  * `name` [`<String>`][] Static value of `RegExpError`
  * `expected` [`<RegExp>`][] The regular expression that is expected to
    match the discovered value
  * `actual` *(Any)* The value that was discovered in the environment
  * `env` [`<String>`][] The name of the evironment variable that is supposed
    to hold the value (upper cased with underscores, e.g. `MY_VARIABLE`)

This error is thrown if [`Config.regex()`](#configregexname) was used,
but the discovered value in the environment did not match the pattern.

### `'EnumError'`

* [`<Error>`][]
  * `name` [`<String>`][] Static value of `EnumError`
  * `expected` [`<Array>`][] The list of acceptable values for the definition
  * `actual` *(Any)* The value that was discovered in the environment
  * `env` [`<String>`][] The name of the evironment variable that is supposed
    to hold the value (upper cased with underscores, e.g. `MY_VARIABLE`)

This error is thrown if [`Config.regex()`](#configregexname) was used,
but the discovered value in the environment did not match the pattern.

[`<Array>`]: https://mdn.io/array
[`<Boolean>`]: https://mdn.io/boolean
[`<Map>`]: https://mdn.io/map
[`<Number>`]: https://mdn.io/number
[`<Object>`]: https://mdn.io/object
[`<Primitive>`]: https://mdn.io/Primitive
[`<RegExp>`]: https://mdn.io/RegExp
[`<String>`]: https://mdn.io/string
[`<TypeError>`]: https://mdn.io/TypeError
[`<RangeError>`]: https://mdn.io/RangeError
[`<Error>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
