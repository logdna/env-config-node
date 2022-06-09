'use strict'

const path = require('path')
const {promisify} = require('util')
const cp = require('child_process')
const fs = require('fs')
const {test} = require('tap')
const bin = path.join(__dirname, '../bin/cmd.js')
const exec = promisify(cp.exec)
const readFile = promisify(fs.readFile)

test('bin', async (t) => {
  t.test('with no args exits with 1', async (t) => {
    try {
      await exec(bin)
      t.fail('exec should have rejected')
    } catch (err) {
      t.equal(err.code, 1, 'exited with code 1')
      t.equal(err.stderr, 'Usage: config-doc <path to config>\n', 'stderr')
    }
  })

  t.test('with arg exits with 0', async (t) => {
    const fixture = path.join(__dirname, 'fixtures/config.js')
    const output_fp = path.join(__dirname, 'fixtures/output.md')
    const output = await readFile(output_fp, 'utf8')
    const {stdout} = await exec(`${bin} ${fixture}`)
    t.equal(stdout, output, 'stdout is correct')
  })
})
