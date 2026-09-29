/* ==========================================================================
   ALGO VIZ - Binary Search Implementation
   Includes auto-sorting, pointer tracking (LOW, MID, HIGH),
   and visual elimination of discarded halves
   ========================================================================== */

export function generateBinarySearchSteps(initialArray, { target = 25 } = {}) {
  const steps = [];
  // Binary search requires sorted array
  const arr = [...initialArray].sort((a, b) => a - b);
  const n = arr.length;
  const numTarget = Number(target);

  let comparisons = 0;
  let accesses = 0;

  steps.push({
    array: [...arr],
    indices: [],
    pointers: {},
    eliminatedIndices: [],
    stateType: 'default',
    codeLine: 0,
    description: `Array pre-sorted (Binary Search requires ordered input). Searching for target: ${numTarget}`,
    stats: { comparisons, swaps: 0, accesses, step: 0 }
  });

  let low = 0;
  let high = n - 1;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    accesses++;

    // Calculate eliminated indices so far
    const eliminated = [];
    for (let k = 0; k < low; k++) eliminated.push(k);
    for (let k = high + 1; k < n; k++) eliminated.push(k);

    steps.push({
      array: [...arr],
      indices: [mid],
      pointers: { low, mid, high, target: numTarget },
      eliminatedIndices: [...eliminated],
      stateType: 'compare',
      codeLine: 2,
      description: `Pointers: LOW=${low} (val ${arr[low]}), MID=${mid} (val ${arr[mid]}), HIGH=${high} (val ${arr[high]})`,
      stats: { comparisons, swaps: 0, accesses, step: steps.length }
    });

    if (arr[mid] === numTarget) {
      found = true;
      steps.push({
        array: [...arr],
        indices: [mid],
        pointers: { found: mid, target: numTarget },
        eliminatedIndices: [...eliminated],
        stateType: 'sorted',
        codeLine: 4,
        description: `Target ${numTarget} FOUND at index ${mid}! Located in ${comparisons} iterations.`,
        stats: { comparisons, swaps: 0, accesses, step: steps.length }
      });
      break;
    } else if (arr[mid] < numTarget) {
      steps.push({
        array: [...arr],
        indices: [mid],
        pointers: { low, mid, high, target: numTarget },
        eliminatedIndices: [...eliminated],
        stateType: 'pivot',
        codeLine: 6,
        description: `A[${mid}] (${arr[mid]}) < ${numTarget}. Target is greater, discarding left half [${low}..${mid}].`,
        stats: { comparisons, swaps: 0, accesses, step: steps.length }
      });
      low = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        indices: [mid],
        pointers: { low, mid, high, target: numTarget },
        eliminatedIndices: [...eliminated],
        stateType: 'pivot',
        codeLine: 8,
        description: `A[${mid}] (${arr[mid]}) > ${numTarget}. Target is smaller, discarding right half [${mid}..${high}].`,
        stats: { comparisons, swaps: 0, accesses, step: steps.length }
      });
      high = mid - 1;
    }
  }

  if (!found) {
    const allEliminated = Array.from({ length: n }, (_, i) => i);
    steps.push({
      array: [...arr],
      indices: [],
      pointers: { target: numTarget },
      eliminatedIndices: allEliminated,
      stateType: 'eliminated',
      codeLine: 9,
      description: `Search interval exhausted (LOW > HIGH). Target ${numTarget} is NOT in the array.`,
      stats: { comparisons, swaps: 0, accesses, step: steps.length }
    });
  }

  return steps;
}
