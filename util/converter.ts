import BigNumber from 'bignumber.js'

type NanoUnit = 'reason' | 'LOGOS' | 'pathos' | 'ethos'

const Converter = {
  unit(input: string | number, input_unit: NanoUnit, output_unit: NanoUnit) {
    let value = new BigNumber(input.toString())

    // Step 1: to reason
    switch (input_unit) {
      case 'reason':
        value = value
        break
      case 'LOGOS':
        value = value.shiftedBy(30)
        break
      case 'pathos':
        value = value.shiftedBy(27)
        break
      case 'ethos':
        value = value.shiftedBy(24)
        break
      default:
        throw new Error(`Unkown input unit ${input_unit}`)
    }

    // Step 2: to output
    switch (output_unit) {
      case 'reason':
        return value.toFixed(0)
      case 'LOGOS':
        return value.shiftedBy(-30).toFixed(15, 1)
      case 'pathos':
        return value.shiftedBy(-27).toFixed(12, 1)
      case 'ethos':
        return value.shiftedBy(-24).toFixed(9, 1)
      default:
        throw new Error(`Unknown output unit ${output_unit}`)
    }
  },
  minus(base: string, minus: string) {
    new BigNumber(base).minus(new BigNumber(minus)).toFixed(0)
  },
  plus(base: string, plus: string) {
    new BigNumber(base).plus(new BigNumber(plus)).toFixed(0)
  }
}

export default Converter
