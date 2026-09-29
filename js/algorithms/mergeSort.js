/* ==========================================================================
   ALGO VIZ - Merge Sort Implementation
   ========================================================================== */

export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set();

  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'default',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 0,
    description: 'Starting Merge Sort. Recursively splitting array into halves.',
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  function merge(left, mid, right) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    accesses += (right - left + 1);

    let i = 0;
    let j = 0;
    let k = left;

    steps.push({
      array: [...arr],
      indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      stateType: 'key',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 5,
      description: `Merging sublists [${left}..${mid}] and [${mid + 1}..${right}]`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...arr],
        indices: [left + i, mid + 1 + j],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Comparing left value ${leftPart[i]} with right value ${rightPart[j]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
      }
      swaps++;
      accesses++;

      steps.push({
        array: [...arr],
        indices: [k],
        stateType: 'swap',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Placed ${arr[k]} into merged position A[${k}]`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      swaps++;
      accesses += 2;
      i++;

      steps.push({
        array: [...arr],
        indices: [k],
        stateType: 'swap',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Copying remaining left element ${arr[k]} to A[${k}]`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      swaps++;
      accesses += 2;
      j++;

      steps.push({
        array: [...arr],
        indices: [k],
        stateType: 'swap',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Copying remaining right element ${arr[k]} to A[${k}]`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      k++;
    }

    // If whole array is merged, mark all sorted
    if (left === 0 && right === n - 1) {
      for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);
    }
  }

  function mergeSortHelper(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...arr],
      indices: [left, mid, right],
      stateType: 'compare',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 2,
      description: `Dividing range [${left}..${right}] at midpoint ${mid}`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSortHelper(0, n - 1);

  for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);
  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 6,
    description: `Merge Sort complete! Array fully sorted with ${comparisons} comparisons.`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
