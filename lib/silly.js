const data = require('./silly-data')
const allOptions = {
  textMode: [
    '',
    'TitleCase'
  ],
  separator: [
    '',
    ' ',
    '-'
  ]
}

class Generator {
  constructor (options) {
    this.options = this.normalizeOptions(options)
  }
  generate (options) {
    let output = `${this.randomVal(data.adjectives)}${this.options.separator}`
    output += `${this.randomVal(data.adjectives)}${this.options.separator}`
    output += `${this.randomVal(data.nouns)}`
    return output
  }
  
  randomVal (arr) {
    let output = arr[Math.floor(Math.random() * arr.length)]
    return this.convert(output)
  }
  
  convert (str) {
    if (this.options.textMode === 'TitleCase') {
      return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase()
    }
    return str
  }
  
  normalizeOptions (options) {
    let normalized = {}
    for (let o in allOptions) {
      normalized[o] = options[o]
      if(allOptions[o].indexOf(options[o]) === -1) {
        normalized[o] = allOptions[o][0]
      }
    }
    return normalized
  }
}

module.exports = Generator