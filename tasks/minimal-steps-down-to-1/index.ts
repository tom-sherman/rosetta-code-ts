export type MinimalStepsOptions = {
  divisors?: number[]
  subtractors?: number[]
}

class SubtractStep {
  readonly operator = '-'
  constructor(public readonly value: number) {}
}

class DivideStep {
  readonly operator = '/'
  constructor(public readonly value: number) {}
}

type Step = SubtractStep | DivideStep

export function minimalSteps(
  start: number,
  { divisors = [], subtractors = [] }: MinimalStepsOptions = {}
): readonly Step[] {
  const possibleStepsLookup = new StepLookup(divisors, subtractors)

  return possibleStepsLookup.computeBranch(start, [])
}

/**
 * A datastructure to store and retrieve memoized steps for any given value, divisors, and subtractors.
 */
export class StepLookup {
  private possibleStepMap: Map<number, readonly Step[]> = new Map()
  private subBranchMap: Map<number, (readonly Step[])[]> = new Map()

  constructor(
    private divisors: number[],
    private subtractors: number[],
    private possibleNextStepsFn = getPossibleNextSteps
  ) {}

  getPossibleSteps(value: number) {
    // If we already have calculates the possible steps, just return the memoized values
    if (this.possibleStepMap.has(value)) {
      // Unfortnately we have to assert the type ourselves here.
      // See https://github.com/microsoft/TypeScript/issues/13086
      return this.possibleStepMap.get(value) as Step[]
    } else {
      // We haven't calculated the possible steps for this value yet so we do that now
      const steps = this.possibleNextStepsFn(value, {
        divisors: this.divisors,
        subtractors: this.subtractors
      })
      this.possibleStepMap.set(value, steps)
      return steps
    }
  }

  computeBranch(
    value: number,
    currentBranch: readonly Step[]
  ): readonly Step[] {
    const possibleSteps = this.getPossibleSteps(value)

    if (possibleSteps.length === 0) {
      return currentBranch
    }

    let subBranches: (readonly Step[])[]
    if (this.subBranchMap.has(value)) {
      subBranches = this.subBranchMap.get(value) as (readonly Step[])[]
    } else {
      subBranches = possibleSteps.map(step => {
        const nextValue = executeStep(value, step)
        return this.computeBranch(nextValue, [...currentBranch, step])
      })
      this.subBranchMap.set(value, subBranches)
    }

    const smallestSubBranch = subBranches.reduce(
      (currentSmallestBranch, branch) =>
        branch.length < currentSmallestBranch.length
          ? branch
          : currentSmallestBranch,
      subBranches[0]
    )

    return smallestSubBranch
  }
}

export function getPossibleNextSteps(
  n: number,
  { divisors, subtractors }: Required<MinimalStepsOptions>
): Step[] {
  if (n === 1) {
    return []
  }

  return [
    ...subtractors.map(s => new SubtractStep(s)),
    ...divisors.filter(d => n % d === 0).map(d => new DivideStep(d))
  ]
}

export function executeStep(value: number, step: Step): number {
  if (step instanceof DivideStep) {
    return value / step.value
  } else if (step instanceof SubtractStep) {
    return value - step.value
  } else {
    // This should never happen
    throw new Error('Step is not a valid instance.')
  }
}

function stringifyStep(value: number, step: Step): string {
  return `${step.operator}${step.value} -> ${executeStep(value, step)}`
}

export function stringifySteps(start: number, steps: readonly Step[]): string {
  let previousValue = start
  const strings: string[] = []
  for (const step of steps) {
    strings.push(stringifyStep(previousValue, step))
    previousValue = executeStep(previousValue, step)
  }

  return strings.join(', ')
}
