/* ==========================================================================
   ALGO VIZ - Selection Sort Implementation
   ========================================================================== */

export function generateSelectionSortSteps(initialArray) {
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
    description: 'Starting Selection Sort. Finding the minimum element for each position.',
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    steps.push({
      array: [...arr],
      indices: [minIdx],
      stateType: 'pivot',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 1,
      description: `Setting initial minimum at index ${minIdx} (value ${arr[minIdx]})`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...arr],
        indices: [minIdx, j],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 3,
        description: `Comparing candidate A[${j}] = ${arr[j]} with current minimum A[${minIdx}] = ${arr[minIdx]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          indices: [minIdx],
          stateType: 'pivot',
          sortedIndices: Array.from(sortedIndices),
          codeLine: 4,
          description: `New minimum found at index ${minIdx} (value ${arr[minIdx]})`,
          stats: { comparisons, swaps, accesses, step: steps.length }
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      accesses += 4;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        indices: [i, minIdx],
        stateType: 'swap',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Swapped minimum element ${arr[i]} into index ${i}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });
    }

    sortedIndices.add(i);
    steps.push({
      array: [...arr],
      indices: [i],
      stateType: 'sorted',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 6,
      description: `Index ${i} (${arr[i]}) is now sorted.`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });
  }

  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 6,
    description: `Selection Sort complete! Performed ${comparisons} comparisons and ${swaps} swaps.`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
