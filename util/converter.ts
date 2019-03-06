const bigInt = require('big-integer')

type LogosUnit = 'reason' | 'LOGOS'

const Converter = {
  unit(input: string | number, input_unit: LogosUnit | number, output_unit: LogosUnit | number) {
    let value = new bigInt(input)

    // Step 1: to reason
    switch (input_unit) {
      case 'reason':
        value = value
        break
      case 'LOGOS':
        value = value.times('1e'+30)
        break
      default:
        let input = parseInt(input_unit.toString())
        if (!isNaN(input)) {
          return value.times('1e'+input)
        } else {
          throw new Error(`Unkown input unit ${input_unit}`)
        }
    }

    // Step 2: to output
    switch (output_unit) {
      case 'reason':
        return value.toString()
      case 'LOGOS':
        return value.divide(bigInt(10).pow(30)).toString()
      default:
        let output = parseInt(output_unit.toString())
        if (!isNaN(output)) {
          return value.divide(bigInt(10).pow(output)).toString()
        } else {
          throw new Error(`Unknown output unit ${output_unit}`)
        }
    }
  },
  minus(base: string, minus: string) {
    new bigInt(base).minus(new bigInt(minus)).toString()
  },
  plus(base: string, plus: string) {
    new bigInt(base).plus(new bigInt(plus)).toString()
  }
}

export default Converter
