#!/usr/bin/env node

'use strict'

const path = require('path')
const toMarkdown = require('../lib/to-markdown.js')

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: config-doc <path to config>')
  process.exitCode = 1
  return
}

console.log(toMarkdown(require(path.resolve(arg))))
