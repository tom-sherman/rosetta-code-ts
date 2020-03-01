export function lexOrder(n: number) {
  return range(1, n).sort((a, b) => String(a).localeCompare(String(b)))
}

const range = (start: number, end: number) =>
  new Array(end - start + 1).fill(null).map((_, index) => start + index)
