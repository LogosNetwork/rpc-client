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
        if (Number.isInteger(input_unit)) {
          value = value.times('1e'+input_unit)
        } else {
          throw new Error(`Unkown input unit ${input_unit}`)
        }
    }

    // Step 2: to output
    switch (output_unit) {
      case 'reason':
        return value.toFixed(0)
      case 'LOGOS':
        return value.times('1e'+-30).toFixed(15, 1)
      default:
        if (Number.isInteger(output_unit)) {
          value = value.times('1e'+-output_unit).toFixed(15, 1)
        } else {
          throw new Error(`Unknown output unit ${output_unit}`)
        }
    }
  },
  minus(base: string, minus: string) {
    new bigInt(base).minus(new bigInt(minus)).toFixed(0)
  },
  plus(base: string, plus: string) {
    new bigInt(base).plus(new bigInt(plus)).toFixed(0)
  }
}

export default Converter
