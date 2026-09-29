/* ==========================================================================
   ALGO VIZ - Linear Search Implementation
   ========================================================================== */

export function generateLinearSearchSteps(initialArray, { target = 25 } = {}) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  const numTarget = Number(target);

  let comparisons = 0;
  let accesses = 0;

  steps.push({
    array: [...arr],
    indices: [],
    pointers: {},
    stateType: 'default',
    codeLine: 0,
    description: `Starting Linear Search for target value: ${numTarget}`,
    stats: { comparisons, swaps: 0, accesses, step: 0 }
  });

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    comparisons++;
    accesses++;

    steps.push({
      array: [...arr],
      indices: [i],
      pointers: { current: i, target: numTarget },
      stateType: 'compare',
      codeLine: 1,
      description: `Checking index ${i}: Is A[${i}] (${arr[i]}) == target (${numTarget})?`,
      stats: { comparisons, swaps: 0, accesses, step: steps.length }
    });

    if (arr[i] === numTarget) {
      foundIndex = i;

      steps.push({
        array: [...arr],
        indices: [i],
        pointers: { found: i, target: numTarget },
        stateType: 'sorted', // Found state
        codeLine: 2,
        description: `Target ${numTarget} FOUND at index ${i}! Search completed in ${comparisons} comparisons.`,
        stats: { comparisons, swaps: 0, accesses, step: steps.length }
      });
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      indices: [],
      pointers: { target: numTarget },
      stateType: 'eliminated',
      codeLine: 3,
      description: `Target ${numTarget} was NOT found in the array after checking all ${n} elements.`,
      stats: { comparisons, swaps: 0, accesses, step: steps.length }
    });
  }

  return steps;
}
