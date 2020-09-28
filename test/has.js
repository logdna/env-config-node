'use strict'

const {test} = require('tap')
const has = require('../lib/has.js')

test('has()', async (t) => {
  t.ok(has({a: 1}, 'a'), 'returns true for prop in object')

  t.notOk(has({a: 1}, 'b'), 'returns false if property not in object')

  {
    const obj = {a: 1}
    const obj2 = Object.create(obj)
    t.notOk(has(obj2, 'a'), 'returns false for prop in proto chain')
  }
})
