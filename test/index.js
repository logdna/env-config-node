'use strict'

const {test} = require('tap')
const Env = require('../index.js')

test('Env', async (t) => {
  t.test('throws if input is not an array', async (t) => {
    t.throws(() => {
      new Env()
    }, /input must be an array/)
  })

  t.test('works with no rules', async (t) => {
    t.doesNotThrow(() => {
      new Env([])
    })
  })

  t.test('works with multiple rules', async (t) => {
    const env = new Env([
      Env.enum('loglevel').values(['info', 'error']).default('info')
    , Env.boolean('pretty-print').default(false)
    , Env.number('thing-count').default(5)
    , Env.regex('count').match(/\d/).default(5)
    , Env.string('company').default('LogDNA')
    ])

    env.validateEnvVars()
    t.strictEqual(env.get('loglevel'), 'info')
    t.strictEqual(env.get('pretty-print'), false)
    t.strictEqual(env.get('thing-count'), 5)
    t.strictEqual(env.get('count'), 5)
    t.strictEqual(env.get('company'), 'LogDNA')

    t.deepEqual(env.toJSON(), {
      'loglevel': 'info'
    , 'pretty-print': false
    , 'thing-count': 5
    , 'count': 5
    , 'company': 'LogDNA'
    })
  })

  t.test('throws if duplicate rules are passed', async (t) => {
    t.throws(() => {
      new Env([
        Env.string('biscuits')
      , Env.string('biscuits')
      ])
    }, /Rule with name "biscuits" already exists/)
  })
})
