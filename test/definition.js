'use strict'

const {test} = require('tap')
const Definition = require('../lib/definition.js')
const {
  TRUE_VALUES,
  FALSE_VALUES
} = require('../lib/boolean-values.js')

test('Definition', async (t) => {
  t.test('constructor', async (t) => {
    const bool = new Definition('boolean', 'bool-test')
    t.equal(bool._required, false, 'required === false')
    t.equal(bool._name, 'bool-test', 'name === bool-test')
    t.equal(bool._env, 'BOOL_TEST', 'env === BOOL_TEST')
    t.equal(bool._type, 'boolean', 'type === boolean')

    const num = new Definition('number', 'number-test')
    t.equal(num._required, false, 'required === false')
    t.equal(num._name, 'number-test', 'name === number-test')
    t.equal(num._env, 'NUMBER_TEST', 'env === NUMBER_TEST')
    t.equal(num._type, 'number', 'type === number')

    const string = new Definition('string', 'string-test')
    t.equal(string._required, false, 'required === false')
    t.equal(string._name, 'string-test', 'name === string-test')
    t.equal(string._env, 'STRING_TEST', 'env === STRING_TEST')
    t.equal(string._type, 'string', 'type === string')

    const re = new Definition('regex', 'regex-test')
    t.equal(re._required, false, 'required === false')
    t.equal(re._name, 'regex-test', 'name === regex-test')
    t.equal(re._env, 'REGEX_TEST', 'env === REGEX_TEST')
    t.equal(re._type, 'regex', 'type === regex')

    const list = new Definition('list', 'list-test')
    t.equal(list._required, false, 'required === false')
    t.equal(list._name, 'list-test', 'name === list-test')
    t.equal(list._env, 'LIST_TEST', 'env === LIST_TEST')
    t.equal(list._type, 'list', 'type === list')
    t.match(list._list_separator, /\s+|,/, 'default list separator')

    t.throws(() => {
      new Definition('biscuits', 'fake')
    }, /Invalid type: "biscuits"/, 'Invalid type throws')
  })

  t.test('required()', async (t) => {
    const def = new Definition('string', 'required-test')
    t.equal(def._required, false, 'required === false')
    t.equal(def.required(), def, 'returns this')
    t.equal(def._required, true, 'required === true')
  })

  t.test('allowEmpty()', async (t) => {
    const def = new Definition('string', 'can-be-empty')
    t.equal(def._allow_empty, false, '_allow_empty === false')
    t.equal(def.allowEmpty(), def, 'returns this')
    t.equal(def._allow_empty, true, '_allow_empty === true')
  })

  t.test('required() and default() mutex', async (t) => {
    t.throws(() => {
      const def = new Definition('string', 'mutex-string').required().default('nope')
      def.validate()
    }, {
      name: 'RequiredDefaultMutexError'
    , message: '".default()" and ".required()" are mutually exclusive for '
        + 'ENV VAR "MUTEX_STRING"'
    }, 'The expected error was thrown')
  })

  t.test('desc()', async (t) => {
    const def = new Definition('string', 'desc-test')
    t.equal(def._description, null, 'description === null')
    t.equal(def.desc('Test'), def, 'returns this')
    t.equal(def._description, 'Test', 'description === \'Test\'')
  })

  t.test('description()', async (t) => {
    const def = new Definition('string', 'description-test')
    t.equal(def._description, null, 'description === null')
    t.equal(def.description('Test'), def, 'returns this')
    t.equal(def._description, 'Test', 'description === \'Test\'')
  })

  t.test('default()', async (t) => {
    const def = new Definition('string', 'default-test')
    t.equal(def._default, null, 'default === null')
    t.equal(def.default('1234'), def, 'returns this')
    t.equal(def._default, '1234', 'default === \'1234\'')
  })

  t.test('match()', async (t) => {
    const def = new Definition('regex', 'match-test')
    t.equal(def._match, null, 'match === null')
    t.equal(def.match('1234'), def, 'returns this')
    t.equal(def._match, '1234', 'match === \'1234\'')

    t.throws(() => {
      const def = new Definition('string', 'match-test')
      def.match(1234)
    }, /\.match\(\) only valid for regex/)
  })

  t.test('min()', async (t) => {
    const def = new Definition('number', 'min-test')
    t.equal(def._min, null, 'min === null')
    t.equal(def.min('1234'), def, 'returns this')
    t.equal(def._min, '1234', 'min === \'1234\'')

    t.throws(() => {
      const def = new Definition('string', 'min-test')
      def.min(1234)
    }, /\.min\(\) only valid for number/)
  })

  t.test('max()', async (t) => {
    const def = new Definition('number', 'max-test')
    t.equal(def._max, null, 'max === null')
    t.equal(def.max('1234'), def, 'returns this')
    t.equal(def._max, '1234', 'max === \'1234\'')

    t.throws(() => {
      const def = new Definition('string', 'max-test')
      def.max(1234)
    }, /\.max\(\) only valid for number/)
  })

  t.test('type()', async (t) => {
    const def = new Definition('list', 'list-test')
    def.type('string')
    t.equal(def._list_type, 'string', 'expected list type string')

    def.type('boolean')
    t.equal(def._list_type, 'boolean', 'expected list type boolean')

    def.type('number')
    t.equal(def._list_type, 'number', 'expected list type number')

    t.throws(() => {
      def.type('regex')
    }, 'Invalid List type: "regex"')

    t.throws(() => {
      const def = new Definition('number', 'a-number')
      def.type('number')
    }, '.type() only valid for list')
  })

  t.test('toJSON()', async (t) => {
    t.test('string', async (t) => {
      const def = new Definition('string', 'string-test')
      def
        .default('biscuits')
        .desc('description')
        .required()

      t.same(def.toJSON(), {
        'name': 'string-test'
      , 'env': 'STRING_TEST'
      , 'default': 'biscuits'
      , 'description': 'description'
      , 'match': null
      , 'type': 'string'
      , 'required': true
      , 'min': null
      , 'max': null
      , 'list_type': null
      , 'separator': /\s+|,/
      , 'allow_empty': false
      })
    })

    t.test('number', async (t) => {
      const def = new Definition('number', 'number-test')
      def
        .default(20)
        .desc('description')
        .required()
        .min(0)
        .max(100)

      t.same(def.toJSON(), {
        'name': 'number-test'
      , 'env': 'NUMBER_TEST'
      , 'default': 20
      , 'description': 'description'
      , 'match': null
      , 'type': 'number'
      , 'required': true
      , 'min': 0
      , 'max': 100
      , 'list_type': null
      , 'separator': /\s+|,/
      , 'allow_empty': false
      })
    })

    t.test('boolean', async (t) => {
      const def = new Definition('boolean', 'boolean-test')
      def
        .default(false)
        .desc('description')
        .required()

      t.same(def.toJSON(), {
        'name': 'boolean-test'
      , 'env': 'BOOLEAN_TEST'
      , 'default': false
      , 'description': 'description'
      , 'match': null
      , 'type': 'boolean'
      , 'required': true
      , 'min': null
      , 'max': null
      , 'list_type': null
      , 'separator': /\s+|,/
      , 'allow_empty': false
      })
    })

    t.test('allowEmpty', async (t) => {
      const def = new Definition('string', 'string-empty')
      def
        .default('some default')
        .desc('description')
        .allowEmpty()

      t.same(def.toJSON(), {
        'name': 'string-empty'
      , 'env': 'STRING_EMPTY'
      , 'default': 'some default'
      , 'description': 'description'
      , 'match': null
      , 'type': 'string'
      , 'required': false
      , 'min': null
      , 'max': null
      , 'list_type': null
      , 'separator': /\s+|,/
      , 'allow_empty': true
      })
    })

    t.test('list', async (t) => {
      {
        const def = new Definition('list', 'list-test')
        def
          .default(false)
          .desc('description')
          .type('boolean')

        t.same(def.toJSON(), {
          'name': 'list-test'
        , 'env': 'LIST_TEST'
        , 'default': false
        , 'description': 'description'
        , 'match': null
        , 'type': 'list'
        , 'required': false
        , 'min': null
        , 'max': null
        , 'list_type': 'boolean'
        , 'separator': /\s+|,/
        , 'allow_empty': false
        })
      }

      {
        const def = new Definition('list', 'list-test').separator(':')
        def
          .default(false)
          .desc('description')
          .type('boolean')

        t.same(def.toJSON(), {
          'name': 'list-test'
        , 'env': 'LIST_TEST'
        , 'default': false
        , 'description': 'description'
        , 'match': null
        , 'type': 'list'
        , 'required': false
        , 'min': null
        , 'max': null
        , 'list_type': 'boolean'
        , 'separator': ':'
        , 'allow_empty': false
        })
      }
    })

    t.test('regex', async (t) => {
      {
        const def = new Definition('regex', 'regex-test')
        def
          .default('info')
          .desc('description')
          .required()
          .match('info|verbose')

        t.same(def.toJSON(), {
          'name': 'regex-test'
        , 'env': 'REGEX_TEST'
        , 'default': 'info'
        , 'description': 'description'
        , 'match': 'info|verbose'
        , 'type': 'regex'
        , 'required': true
        , 'min': null
        , 'max': null
        , 'list_type': null
        , 'separator': /\s+|,/
        , 'allow_empty': false
        })
      }

      {
        const def = new Definition('regex', 'regex-test')
        def
          .default('info')
          .desc('description')
          .required()
          .match(/info|verbose/)

        t.same(def.toJSON(), {
          'name': 'regex-test'
        , 'env': 'REGEX_TEST'
        , 'default': 'info'
        , 'description': 'description'
        , 'match': '/info|verbose/'
        , 'type': 'regex'
        , 'required': true
        , 'min': null
        , 'max': null
        , 'list_type': null
        , 'separator': /\s+|,/
        , 'allow_empty': false
        })
      }
    })
  })

  t.test('validate()', async (t) => {
    t.test('string', async (t) => {
      t.test('throws when required env var is missing', async (t) => {
        const def = new Definition('string', 'string-test')
        def
          .desc('description')
          .required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "STRING_TEST" of type "string"/)
      })

      t.test('throws when env var is empty and required', async (t) => {
        process.env.REQUIRED_STRING = ''
        const def = new Definition('string', 'required-string')
        def
          .desc('description')
          .required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "REQUIRED_STRING" of type "string"/)
      })

      t.test('passes when optional with default', async (t) => {
        process.env.OPTIONAL_STRING = ''
        const def = new Definition('string', 'optional-string')
        def
          .default('biscuits')
          .desc('description')

        def.validate()
        t.equal(def._value, 'biscuits', 'Default value applied for an empty string')
      })

      t.test('passes when the default value is not needed', async (t) => {
        process.env.OPTIONAL_STRING = 'myvalue'
        const def = new Definition('string', 'optional-string')
        def
          .default('biscuits')
          .desc('description')

        def.validate()
        t.equal(def._value, 'myvalue', 'The set env var value was used')
      })

      t.test('passes when required and not empty', async (t) => {
        process.env.REQUIRED_STRING = 'STRING'
        const def = new Definition('string', 'required-string')
        def
          .desc('description')
          .required()

        t.doesNotThrow(() => {
          def.validate()
        }, 'validation passes')
        t.equal(def._value, 'STRING', 'The value was set correctly')
      })

      t.test('Does not apply default if allowEmpty()', async (t) => {
        process.env.ALLOW_EMPTY = ''
        const def = new Definition('string', 'allow-empty').default('nope').allowEmpty()

        t.doesNotThrow(() => {
          def.validate()
        }, 'validation passes')
        t.equal(def._value, '', 'The value was allowed to be empty')
      })
    })

    t.test('number', async (t) => {
      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('number', 'number-test')
        def
          .desc('description')
          .required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "NUMBER_TEST" of type "number"/)
      })

      t.test('passes when optional with default', async (t) => {
        process.env.NUMBER_TEST2 = ''
        const def = new Definition('number', 'number-test2')
        def
          .default(25)
          .desc('description')

        def.validate()
        t.equal(def._value, 25, 'Default value applied for an empty string')
      })

      t.test('Does not apply default if allowEmpty()', async (t) => {
        process.env.ALLOW_EMPTY = ''
        const def = new Definition('number', 'allow-empty').default(123).allowEmpty()

        t.doesNotThrow(() => {
          def.validate()
        }, 'validation passes')
        t.equal(def._value, 0, 'Empty value was casted')
      })

      t.test('passes when required and not empty', async (t) => {
        {
          process.env.NUMBER_TEST = '25'
          const def = new Definition('number', 'number-test')
          def
            .desc('description')
            .min(0)
            .required()

          def.validate()
          t.equal(def._value, 25, 'value === 25')
        }

        {
          process.env.NUMBER_TEST = '25'
          const def = new Definition('number', 'number-test')
          def
            .desc('description')
            .max(100)
            .required()

          def.validate()
          t.equal(def._value, 25, 'value === 25')
        }
      })

      t.test('throws when value lower than min', async (t) => {
        process.env.NUMBER_TEST = '10'
        const def = new Definition('number', 'number-test')
        def
          .min(20)

        t.throws(() => {
          def.validate()
        }, /Invalid ENV VAR \(NUMBER_TEST\) - 10 less than 20/)
      })

      t.test('throws when value higher than max', async (t) => {
        process.env.NUMBER_TEST = '10'
        const def = new Definition('number', 'number-test')
        def
          .max(5)

        t.throws(() => {
          def.validate()
        }, /Invalid ENV VAR \(NUMBER_TEST\) - 10 greater than 5/)
      })

      t.test('throws when NaN', async (t) => {
        process.env.NUMBER_TEST = 'abcd'
        const def = new Definition('number', 'number-test')

        t.throws(() => {
          def.validate()
        }, /Invalid ENV VAR \(NUMBER_TEST\) - Expected number, got "abcd"/)
      })
    })

    t.test('boolean', async (t) => {
      t.test('Works when optional without default', async (t) => {
        const def = new Definition('boolean', 'optbool-test')

        def._populate()
      })

      t.test('Does not apply default if allowEmpty()', async (t) => {
        process.env.ALLOW_EMPTY = ''
        const def = new Definition('boolean', 'allow-empty').default(true).allowEmpty()

        t.doesNotThrow(() => {
          def.validate()
        }, 'validation passes')
        t.equal(def._value, false, 'Empty value was casted')
      })

      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('boolean', 'bool-test')
        def.required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "BOOL_TEST" of type "boolean"/)
      })

      t.test('throws with invalid boolean value', async (t) => {
        process.env.BOOL_TEST = 'abcd'
        const def = new Definition('boolean', 'bool-test')
        def.required()

        t.throws(() => {
          def.validate()
        }, /Expected boolean, got "abcd"/)
      })

      for (const val of TRUE_VALUES) {
        t.test(`passes with valid true value: "${val}"`, async (t) => {
          process.env.BOOL_TEST = val
          const def = new Definition('boolean', 'bool-test')
          def.required()
          def.validate()
        })
      }

      for (const val of FALSE_VALUES) {
        t.test(`passes with valid false value: "${val}"`, async (t) => {
          process.env.BOOL_TEST = val
          const def = new Definition('boolean', 'bool-test')
          def.required()
          def.validate()
        })
      }
    })

    t.test('regex', async (t) => {
      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('regex', 'regex-test')
        def.required().match(/\d/)

        t.throws(() => {
          def.validate()
        }, {
          name: 'MissingEnvError'
        , type: 'regex'
        , message: 'Missing required ENV VAR "REGEX_TEST" of type "regex"'
        }, 'MissingEnvError was thrown')
      })

      t.test('throws when env var does not match', async (t) => {
        process.env.REGEX_TEST = 'abcd'
        const def = new Definition('regex', 'regex-test')
        def.required().match(/\d/)

        t.throws(() => {
          def.validate()
        }, {
          name: 'RegExpError'
        , message: 'Invalid ENV VAR (REGEX_TEST) - Expected "abcd" '
            + 'to match /\\d/'
        , expected: /\d/
        , actual: 'abcd'
        , env: 'REGEX_TEST'
        }, 'RegExpError error was thrown')
      })

      t.test('passes when env var is omitted', async (t) => {
        const def = new Definition('regex', 'regex2-test')
        def.match(/\d/).default('123')
        def.validate()
        t.equal(def._value, '123', 'The default value was used')
      })

      t.test('passes when env var is empty', async (t) => {
        process.env.REGEX_USE_DEFAULT = ''
        const def = new Definition('regex', 'regex-use-default')
        def.match(/\d/).default('123')
        def.validate()
        t.equal(def._value, '123', 'The default value was used')
      })

      t.test('passes when required and matches with regex', async (t) => {
        process.env.REGEX_TEST = '12345'
        const def = new Definition('regex', 'regex-test')
        def.required().match(/\d/)
        def.validate()
      })

      t.test('passes when required and matches with string re', async (t) => {
        process.env.REGEX_TEST = '12345'
        const def = new Definition('regex', 'regex-test')
        def.required().match('/\\d/')
        def.validate()
      })

      t.test('passes when required and matches with string re', async (t) => {
        process.env.REGEX_TEST = '12345'
        const def = new Definition('regex', 'regex-test')
        def.required().match('\\d')
        def.validate()
      })
    })

    t.test('enum', async (t) => {
      t.test('throws when env var does not match values', async (t) => {
        process.env.LOGLEVEL = 'silly'
        const def = new Definition('enum', 'loglevel')
        def.values(['info', 'error'])

        t.throws(() => {
          def.validate()
        }, {
          name: 'EnumError'
        , message: 'Invalid ENV VAR (LOGLEVEL) - Expected "silly" to be '
            + 'in [info,error]'
        , expected: ['info', 'error']
        , actual: 'silly'
        , env: 'LOGLEVEL'
        }, 'EnumError was thrown')
      })

      t.test('passes when empty and omitted', async (t) => {
        const def = new Definition('enum', 'logleve2')
        def.values(['info', 'error']).default('info')
        def.validate()
      })

      t.test('passes when required and matches with values', async (t) => {
        process.env.LOGLEVEL = 'error'
        const def = new Definition('enum', 'loglevel')
        def.required().values(['info', 'error'])
        def.validate()
      })

      t.test('uses default when env var is the empty string', async (t) => {
        process.env.LOGLEVEL = ''
        const def = new Definition('enum', 'loglevel')
        def.values(['info', 'error']).default('info')
        def.validate()
        t.equal(def._value, 'info', 'The default value was used')
      })

      t.test('Applies passing default when value is the empty string', async (t) => {
        process.env.LOGLEVEL = ''
        const def = new Definition('enum', 'loglevel')
        def.values(['info', 'error', 'silent']).default('silent')
        def.validate()
        t.equal(def._value, 'silent', 'The default value was applied')
      })

      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('enum', 'loglevel2')
        def.required().values(['info', 'error'])

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "LOGLEVEL2" of type "enum"/)
      })
    })

    t.test('list', async (t) => {
      t.test('parses and cleans messy values', async (t) => {
        process.env.MESSY_VALUE = '   a,b  c, d  ,  '
        const def = new Definition('list', 'messy-value').type('string').validate()
        t.same(def._value, ['a', 'b', 'c', 'd'], 'expected array values')
      })

      t.test('uses the default if the env var is the empty string', async (t) => {
        process.env.USE_DEFAULT = ''
        const def = new Definition('list', 'use-default')
        def
          .type('number')
          .default([1, 2, 3])

        def.validate()
        t.same(def._value, [1, 2, 3], 'The default array was used')
      })

      t.test('allowEmpty() produces an empty list for empty string', async (t) => {
        process.env.ALLOW_EMPTY = ''
        const def = new Definition('list', 'allow-empty')
        def
          .type('number')
          .default([1, 2, 3])
          .allowEmpty()

        def.validate()
        t.same(def._value, [], 'An empty list was produced')
      })

      t.test('required - throws when env var is missing', async (t) => {
        const def = new Definition('list', 'unset').type('boolean').required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "UNSET" of type "list"/)
      })

      t.test('required - throws when list is empty', async (t) => {
        process.env.UNSET = ''
        const def = new Definition('list', 'unset').required().type('number')

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "UNSET" of type "list"/)
      })

      t.test('throws when string list has nullish values', async (t) => {
        process.env.BAD_STRING_LIST = ' , , , '
        const def = new Definition('list', 'bad-string-list').required().type('string')

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "BAD_STRING_LIST" of type "list"/)
      })

      t.test('throws when env var has type mis match', async (t) => {
        process.env.FOOBAR = '1,2 , three 4'
        const def = new Definition('list', 'foobar')
        def.type('number')

        t.throws(() => {
          def.validate()
        }, {
          name: 'ListError'
        , message: 'Invalid value in List ENV VAR FOOBAR - '
            + 'Value NaN is not of type number'
        , type: 'number'
        , actual: 'NaN'
        , input: '1,2,NaN,4'
        , original: '1,2 , three 4'
        , env: 'FOOBAR'
        })
      })

      t.test('throws when number is outside of range', async (t) => {
        process.env.FOOBAR = '1 2 3'
        const def = new Definition('list', 'foobar')
        def.type('number').max(2)

        t.throws(() => {
          def.validate()
        }, {
          name: 'ListError'
        , type: 'number'
        , message: 'Invalid value in List ENV VAR FOOBAR - '
            + '3 greater than 2 (1,2,3)'
        , actual: '3'
        , input: '1,2,3'
        , original: '1 2 3'
        , env: 'FOOBAR'
        })
      })
    })
  })
})
