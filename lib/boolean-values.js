'use strict'

const TRUE_VALUES = new Set([
  '1'
, 'TRUE'
, 'true'
, 'YES'
, 'yes'
, 'y'
, 'Y'
, true
, 1
])

const FALSE_VALUES = new Set([
  '0'
, 'FALSE'
, 'false'
, 'NO'
, 'no'
, 'N'
, 'n'
, ''
, false
, 0
])

module.exports = {
  TRUE_VALUES
, FALSE_VALUES
}
