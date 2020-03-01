import { lexOrder } from '.'

test('it sorts', () => {
  expect(lexOrder(13)).toEqual([1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9])
})
