import { minimalSteps, stringifySteps } from '.'

const range = (start: number, end: number) =>
  new Array(end - start + 1).fill(null).map((_, index) => start + index)
let n = 200
const steps = minimalSteps(n, { divisors: [2, 3], subtractors: [1] })
console.log(`${n} (${steps.length} steps): ${stringifySteps(n, steps)}`)

// for (const n of range(200, 500)) {
//   const steps = minimalSteps(n, { divisors: [2, 3], subtractors: [1] })
//   console.log(`${n} (${steps.length} steps): ${stringifySteps(n, steps)}`)
// }
