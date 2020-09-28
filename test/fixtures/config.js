'use strict'

const Config = require('../../')

const input = [
  Config
    .string('my-string')
    .default('string default value')
    .required()
    .desc('This is a string value taken from process.env.MY_STRING')
    .desc('The port for RSS')
, Config
    .number('fake-port')
    .default(3000)
    .min(1025)
    .max(655359)
    .desc(
      'A fake service port, coerced into a number from process.env.FAKE_PORT'
    )
, Config
    .enum('my-enum')
    .default('value3')
    .desc('One value from a list of allowable values')
    .values(['value1', 'value2', 'value3'])
, Config
    .regex('regex-value')
    .match(/there is a number here: \d+/i)
    .desc('The value found in process.env.REGEX_VALUE shoudl match the pattern')
, Config
    .boolean('my-boolean')
    .default(false)
    .desc(
      'process.env.MY_BOOLEAN truthy/falsey values are coerced into a boolean')
, Config
    .string('this-has-no-description')
]

const config = new Config(input)
module.exports = config
