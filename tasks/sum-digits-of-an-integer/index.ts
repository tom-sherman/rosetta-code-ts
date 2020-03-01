export function sumDigits(n: number, base: number = 10): number {
  return Array.from(n.toString(base)).reduce(
    (accumulator, current) => accumulator + parseInt(current, base),
    0
  )
}
