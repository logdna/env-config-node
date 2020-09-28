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

  t.test('toJSON()', async (t) => {
    t.test('string', async (t) => {
      const def = new Definition('string', 'string-test')
      def
        .default('biscuits')
        .desc('description')
        .required()

      t.deepEqual(def.toJSON(), {
        'name': 'string-test'
      , 'env': 'STRING_TEST'
      , 'default': 'biscuits'
      , 'description': 'description'
      , 'match': null
      , 'type': 'string'
      , 'required': true
      , 'min': null
      , 'max': null
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

      t.deepEqual(def.toJSON(), {
        'name': 'number-test'
      , 'env': 'NUMBER_TEST'
      , 'default': 20
      , 'description': 'description'
      , 'match': null
      , 'type': 'number'
      , 'required': true
      , 'min': 0
      , 'max': 100
      })
    })

    t.test('boolean', async (t) => {
      const def = new Definition('boolean', 'boolean-test')
      def
        .default(false)
        .desc('description')
        .required()

      t.deepEqual(def.toJSON(), {
        'name': 'boolean-test'
      , 'env': 'BOOLEAN_TEST'
      , 'default': false
      , 'description': 'description'
      , 'match': null
      , 'type': 'boolean'
      , 'required': true
      , 'min': null
      , 'max': null
      })
    })

    t.test('regex', async (t) => {
      {
        const def = new Definition('regex', 'regex-test')
        def
          .default('info')
          .desc('description')
          .required()
          .match('info|verbose')

        t.deepEqual(def.toJSON(), {
          'name': 'regex-test'
        , 'env': 'REGEX_TEST'
        , 'default': 'info'
        , 'description': 'description'
        , 'match': 'info|verbose'
        , 'type': 'regex'
        , 'required': true
        , 'min': null
        , 'max': null
        })
      }

      {
        const def = new Definition('regex', 'regex-test')
        def
          .default('info')
          .desc('description')
          .required()
          .match(/info|verbose/)

        t.deepEqual(def.toJSON(), {
          'name': 'regex-test'
        , 'env': 'REGEX_TEST'
        , 'default': 'info'
        , 'description': 'description'
        , 'match': '/info|verbose/'
        , 'type': 'regex'
        , 'required': true
        , 'min': null
        , 'max': null
        })
      }
    })
  })

  t.test('validate()', async (t) => {
    t.test('string', async (t) => {
      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('string', 'string-test')
        def
          .default('biscuits')
          .desc('description')
          .required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "STRING_TEST" of type "string"/)
      })

      t.test('throws when env var is empty and required', async (t) => {
        process.env.STRING_TEST = ''
        const def = new Definition('string', 'string-test')
        def
          .default('biscuits')
          .desc('description')
          .required()

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "STRING_TEST" of type "string"/)
      })

      t.test('passes when optional with default', async (t) => {
        process.env.STRING_TEST2 = ''
        const def = new Definition('string', 'string-test2')
        def
          .default('biscuits')
          .desc('description')

        def.validate()
      })

      t.test('passes when required and not empty', async (t) => {
        process.env.STRING_TEST = 'STRING'
        const def = new Definition('string', 'string-test')
        def
          .default('biscuits')
          .desc('description')
          .required()

        def.validate()
      })
    })

    t.test('number', async (t) => {
      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('number', 'number-test')
        def
          .default(25)
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
      })

      t.test('passes when required and not empty', async (t) => {
        {
          process.env.NUMBER_TEST = '25'
          const def = new Definition('number', 'number-test')
          def
            .default(20)
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
            .default(20)
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

      t.test('passes when empty and omitted', async (t) => {
        const def = new Definition('regex', 'regex2-test')
        def.match(/\d/).default('123')
        def.validate()
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


      t.test('throws when env var is missing', async (t) => {
        const def = new Definition('enum', 'loglevel2')
        def.required().values(['info', 'error'])

        t.throws(() => {
          def.validate()
        }, /Missing required ENV VAR "LOGLEVEL2" of type "enum"/)
      })
    })
  })
})
