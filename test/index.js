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
    , Env.list('list-sep').type('boolean').separator(':').default('1:0')
    , Env.list('list-num').type('number').default([2, 10])
    , Env.list('list-str').type('string').default('one two ')
    , Env.list('list-empty').type('string')
    ])

    env.validateEnvVars()
    t.equal(env.get('loglevel'), 'info')
    t.equal(env.get('pretty-print'), false)
    t.equal(env.get('thing-count'), 5)
    t.equal(env.get('count'), 5)
    t.equal(env.get('company'), 'LogDNA')
    t.same(env.get('list-sep'), [true, false])
    t.same(env.get('list-num'), [2, 10])
    t.same(env.get('list-str'), ['one', 'two'])
    t.same(env.get('list-empty'), null)

    t.same(env.toJSON(), {
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
      new Env([
        Env.string('biscuits')
      , Env.string('biscuits')
      ])
    }, /Rule with name "biscuits" already exists/)
  })
})
