'use strict'

const util = require('util')
const {test} = require('tap')
const Config = require('../index.js')
const {createConfig} = require('../index.js')

test('Config', async (t) => {
  t.test('throws if input is not an array', async (t) => {
    t.throws(() => {
      new Config()
    }, /input must be an array/)
  })

  t.test('works with no rules', async (t) => {
    t.doesNotThrow(() => {
      new Config([])
    })
  })

  t.test('works with multiple rules', async (t) => {
    const config = new Config([
      Config.enum('loglevel').values(['info', 'error']).default('info')
    , Config.boolean('pretty-print').default(false)
    , Config.number('thing-count').default(5)
    , Config.regex('count').match(/\d/).default(5)
    , Config.string('company').default('LogDNA')
    , Config.list('list-sep').type('boolean').separator(':').default('1:0')
    , Config.list('list-num').type('number').default([2, 10])
    , Config.list('list-str').type('string').default('one two ')
    , Config.list('list-empty').type('string')
    ])

    config.validateEnvVars()
    t.equal(config.get('loglevel'), 'info')
    t.equal(config.get('pretty-print'), false)
    t.equal(config.get('thing-count'), 5)
    t.equal(config.get('count'), 5)
    t.equal(config.get('company'), 'LogDNA')
    t.same(config.get('list-sep'), [true, false])
    t.same(config.get('list-num'), [2, 10])
    t.same(config.get('list-str'), ['one', 'two'])
    t.same(config.get('list-empty'), null)

    t.same(config.toJSON(), {
      'loglevel': 'info'
    , 'pretty-print': false
    , 'thing-count': 5
    , 'count': 5
    , 'company': 'LogDNA'
    , 'list-sep': [true, false]
    , 'list-num': [2, 10]
    , 'list-str': ['one', 'two']
    , 'list-empty': null
    })
  })

  t.test('throws if duplicate rules are passed', async (t) => {
    t.throws(() => {
      new Config([
        Config.string('biscuits')
      , Config.string('biscuits')
      ])
    }, /Rule with name "biscuits" already exists/)
  })

  t.test('does not redefine property getter on second addRule path', async (t) => {
    const defs = [Config.string('dup').default('one')]
    const config = new Config(defs)
    config.validateEnvVars()
    // Manually invoke internal _addRule again with same rule to hit early duplicate check branch
    t.throws(() => {
      config._addRule(defs[0])
    }, /Rule with name "dup" already exists/)
  })

  t.test('re-adding rule after manual removal skips defineProperty branch', async (t) => {
    const config = new Config([
      Config.string('skip-prop').default('one')
    ])
    config.validateEnvVars()
    // Remove rule/data but keep existing enumerable getter so hasOwnProperty => true while map lacks key
    config.delete('skip-prop')
    config.rules.delete('skip-prop')
    const newRule = Config.string('skip-prop').default('two')
    config._addRule(newRule)
    t.equal(config.get('skip-prop'), 'two')
  })
})

test('Config additional features', async (t) => {
  t.test('createConfig factory mirrors new Config()', async (t) => {
    const defs = [
      Config.string('alpha').default('a')
    , Config.number('beta').default(2)
    ]
    const configA = new Config(defs)
    const configB = createConfig(defs)
    configA.validateEnvVars()
    configB.validateEnvVars()
    t.equal(configA.get('alpha'), 'a')
    t.equal(configB.get('beta'), 2)
  })

  t.test('direct property access returns same as get()', async (t) => {
    const config = new Config([
      Config.string('prop-name').default('value')
    , Config.boolean('flag').default(false)
    ])
    config.validateEnvVars()
    t.equal(config['prop-name'], 'value')
    t.equal(config['prop-name'], config.get('prop-name'))
    t.equal(config.flag, false)
  })

  t.test('inspect custom shows plain object', async (t) => {
    const config = new Config([
      Config.string('inspect-me').default('ok')
    ])
    config.validateEnvVars()
    const out = util.inspect(config)
    t.match(out, /'inspect-me': 'ok'/)
  })
})
