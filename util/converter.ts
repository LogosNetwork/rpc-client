import BigNumber from 'bignumber.js'

type LogosUnit = 'reason' | 'LOGOS'

const Converter = {
  unit(input: string | number, input_unit: LogosUnit | number, output_unit: LogosUnit | number) {
    let value = new BigNumber(input.toString())

    // Step 1: to reason
    switch (input_unit) {
      case 'reason':
        value = value
        break
      case 'LOGOS':
        value = value.shiftedBy(30)
        break
      default:
        let input = parseInt(input_unit.toString())
        if (!isNaN(input)) {
          value.shiftedBy(input)
        } else {
          throw new Error(`Unkown input unit ${input_unit}`)
        }
    }

    // Step 2: to output
    switch (output_unit) {
      case 'reason':
        return value.toString()
      case 'LOGOS':
        return value.shiftedBy(-30).toFixed(15, 1)
      default:
        let output = parseInt(output_unit.toString())
        if (!isNaN(output)) {
          return value.shiftedBy(-output).toFixed(15, 1)
        } else {
          throw new Error(`Unknown output unit ${output_unit}`)
        }
    }
  },
  minus(base: string, minus: string) {
    new BigNumber(base).minus(new BigNumber(minus)).toString()
  },
  plus(base: string, plus: string) {
    new BigNumber(base).plus(new BigNumber(plus)).toString()
  }
}

export default Converter
