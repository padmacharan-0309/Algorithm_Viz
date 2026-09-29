/* ==========================================================================
   ALGO VIZ - Bubble Sort Implementation
   Generates step-by-step visualization timeline
   ========================================================================== */

export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set();

  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  // Initial step
  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'default',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 0,
    description: 'Starting Bubble Sort. Array initialized.',
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    steps.push({
      array: [...arr],
      indices: [],
      stateType: 'default',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 1,
      description: `Pass ${i + 1}: Starting new outer loop, setting swapped = false`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...arr],
        indices: [j, j + 1],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 3,
        description: `Comparing elements A[${j}] = ${arr[j]} and A[${j + 1}] = ${arr[j + 1]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[j] > arr[j + 1]) {
        // Swap step
        swaps++;
        accesses += 4;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          array: [...arr],
          indices: [j, j + 1],
          stateType: 'swap',
          sortedIndices: Array.from(sortedIndices),
          codeLine: 4,
          description: `Swapped: A[${j}] was greater than A[${j + 1}]. New values: [${arr[j]}, ${arr[j + 1]}]`,
          stats: { comparisons, swaps, accesses, step: steps.length }
        });
      }
    }

    // Element n - i - 1 is now in its permanent sorted place
    sortedIndices.add(n - i - 1);
    steps.push({
      array: [...arr],
      indices: [n - i - 1],
      stateType: 'sorted',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 6,
      description: `Element ${arr[n - i - 1]} at index ${n - i - 1} is now in its final sorted position.`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    // Check early termination
    if (!swapped) {
      // All remaining elements are sorted
      for (let k = 0; k < n; k++) sortedIndices.add(k);
      steps.push({
        array: [...arr],
        indices: [],
        stateType: 'sorted',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: 'Early termination: No swaps occurred during this pass. Array is fully sorted!',
        stats: { comparisons, swaps, accesses, step: steps.length }
      });
      break;
    }
  }

  // Ensure all marked sorted
  for (let k = 0; k < n; k++) sortedIndices.add(k);
  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 6,
    description: `Bubble Sort complete! Sorted in ${comparisons} comparisons and ${swaps} swaps.`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
