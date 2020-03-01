import {
  minimalSteps,
  getPossibleNextSteps,
  MinimalStepsOptions,
  StepLookup
} from '.'

describe('minimalSteps', () => {
  test('it works', () => {
    expect(minimalSteps(2, { subtractors: [1] })).toMatchInlineSnapshot(`
      Array [
        SubtractStep {
          "operator": "-",
          "value": 1,
        },
      ]
    `)

    expect(minimalSteps(4, { subtractors: [1] })).toMatchInlineSnapshot(`
      Array [
        SubtractStep {
          "operator": "-",
          "value": 1,
        },
        SubtractStep {
          "operator": "-",
          "value": 1,
        },
        SubtractStep {
          "operator": "-",
          "value": 1,
        },
      ]
    `)

    expect(minimalSteps(4, { subtractors: [1], divisors: [2] })).toHaveLength(2)
    expect(minimalSteps(7, { subtractors: [1], divisors: [2] })).toHaveLength(4)
    expect(minimalSteps(23, { subtractors: [1], divisors: [2] })).toHaveLength(
      7
    )

    expect(
      minimalSteps(11, { subtractors: [1], divisors: [2, 3] })
    ).toHaveLength(4)
  })
})

describe('getPossibleNextSteps', () => {
  test('n = 1 should return no steps', () => {
    expect(getPossibleNextSteps(1, { divisors: [], subtractors: [1] })).toEqual(
      []
    )
  })

  test('n > 1 should return possible steps', () => {
    expect(
      getPossibleNextSteps(2, { divisors: [], subtractors: [1] })
    ).toEqual([{ operator: '-', value: 1 }])

    expect(
      getPossibleNextSteps(7, { divisors: [2], subtractors: [1] })
    ).toEqual([{ operator: '-', value: 1 }])

    const n6 = getPossibleNextSteps(6, { divisors: [2, 3], subtractors: [1] })

    expect(n6).toContainEqual({ operator: '-', value: 1 })
    expect(n6).toContainEqual({ operator: '/', value: 2 })
    expect(n6).toContainEqual({ operator: '/', value: 3 })
    expect(n6).toHaveLength(3)
  })
})

describe('StepLookup', () => {
  test('StepLookup.get should return same value as getPossibleNextSteps for any given value', () => {
    const optionsList: Required<MinimalStepsOptions>[] = [
      { divisors: [], subtractors: [1] },
      { divisors: [2, 3], subtractors: [1] }
    ]

    for (const options of optionsList) {
      const possibleSteps = new StepLookup(
        options.divisors,
        options.subtractors
      )
      expect(possibleSteps.getPossibleSteps(1)).toEqual(
        getPossibleNextSteps(1, options)
      )
      expect(possibleSteps.getPossibleSteps(2)).toEqual(
        getPossibleNextSteps(2, options)
      )
      expect(possibleSteps.getPossibleSteps(3)).toEqual(
        getPossibleNextSteps(3, options)
      )
      expect(possibleSteps.getPossibleSteps(4)).toEqual(
        getPossibleNextSteps(4, options)
      )
      expect(possibleSteps.getPossibleSteps(5)).toEqual(
        getPossibleNextSteps(5, options)
      )
      expect(possibleSteps.getPossibleSteps(6)).toEqual(
        getPossibleNextSteps(6, options)
      )
    }
  })

  test('StepLookup.get should return same value as getPossibleNextSteps for any given value with fresh cache', () => {
    const optionsList: Required<MinimalStepsOptions>[] = [
      { divisors: [], subtractors: [1] },
      { divisors: [2, 3], subtractors: [1] }
    ]

    for (const options of optionsList) {
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          1
        )
      ).toEqual(getPossibleNextSteps(1, options))
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          2
        )
      ).toEqual(getPossibleNextSteps(2, options))
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          3
        )
      ).toEqual(getPossibleNextSteps(3, options))
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          4
        )
      ).toEqual(getPossibleNextSteps(4, options))
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          5
        )
      ).toEqual(getPossibleNextSteps(5, options))
      expect(
        new StepLookup(options.divisors, options.subtractors).getPossibleSteps(
          6
        )
      ).toEqual(getPossibleNextSteps(6, options))
    }
  })

  test('StepLookup should memoize calls to getPossibleNextSteps', () => {
    const options = { divisors: [2, 3], subtractors: [1] }
    const mockedPossibleNextSteps = jest.fn(getPossibleNextSteps)

    const possibleSteps = new StepLookup(
      options.divisors,
      options.subtractors,
      mockedPossibleNextSteps
    )

    possibleSteps.getPossibleSteps(1)
    possibleSteps.getPossibleSteps(2)
    possibleSteps.getPossibleSteps(3)

    expect(mockedPossibleNextSteps).toHaveBeenCalledTimes(3)

    mockedPossibleNextSteps.mockReset()

    possibleSteps.getPossibleSteps(1)
    possibleSteps.getPossibleSteps(2)
    possibleSteps.getPossibleSteps(3)

    expect(mockedPossibleNextSteps).toHaveBeenCalledTimes(0)
  })
})
