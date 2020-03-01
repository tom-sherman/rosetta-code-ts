import { sumDigits } from '.'

test('base 10', () => {
  expect(sumDigits(1000000)).toEqual(1)
  expect(sumDigits(1234)).toEqual(10)
})

test('base 16', () => {
  expect(sumDigits(0xfe, 16)).toEqual(29)
  expect(sumDigits(0xf0e, 16)).toEqual(29)
})
