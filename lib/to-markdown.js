'use strict'

class DocWriter {
  constructor(config) {
    this.buf = []
    this.config = config
  }

  write(str = '') {
    this.buf.push(str)
  }

  render() {
    this.write('## Environment Variables')
    this.write()

    const rule_names = Array.from(this.config.rules.keys()).sort()
    for (const name of rule_names) {
      const rule = this.config.rules.get(name)
      this.write(`### \`${rule._env}\``)
      this.write()
      if (rule._description) {
        this.write(`> ${rule._description}`)
        this.write()
      }

      this.write('| Config | Value |')
      this.write('| --- | --- |')
      this.write(`| Name | \`${rule._name}\` |`)
      this.write(`| Environment Variable | \`${rule._env}\` |`)
      this.write(`| Type | \`${rule._type}\` |`)
      const required = rule._required ? '**yes**' : 'no'
      this.write(`| Required | ${required} |`)
      const def = rule._default !== null
        ? `${rule._default}`
        : '(none)'

      this.write(`| Default | \`${def}\` |`)

      if (rule._match) {
        this.write(`| Match | \`${rule._match}\` |`)
      }

      if (rule._min !== null) {
        this.write(`| Min | \`${rule._min}\` |`)
      }

      if (rule._max !== null) {
        this.write(`| Max | \`${rule._max}\` |`)
      }

      if (rule._values !== null) {
        const str = rule._values.map((value) => {
          return `\`${value}\`<br>`
        }).join('')
        this.write(`| Possible Values | ${str} |`)
      }

      this.write()
      this.write('***')
      this.write()
    }
    return this.buf.join('\n')
  }
}

module.exports = function toMarkdown(config) {
  const writer = new DocWriter(config)
  return writer.render()
}
