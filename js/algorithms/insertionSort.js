/* ==========================================================================
   ALGO VIZ - Insertion Sort Implementation
   ========================================================================== */

export function generateInsertionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set([0]);

  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  steps.push({
    array: [...arr],
    indices: [0],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 0,
    description: `Starting Insertion Sort. Initial single element A[0] = ${arr[0]} is trivially sorted.`,
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    accesses++;
    let j = i - 1;

    steps.push({
      array: [...arr],
      indices: [i],
      stateType: 'key',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 1,
      description: `Picking key element A[${i}] = ${key} to insert into sorted prefix.`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    while (j >= 0) {
      comparisons++;
      accesses++;

      steps.push({
        array: [...arr],
        indices: [j, j + 1],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 3,
        description: `Comparing prefix element A[${j}] = ${arr[j]} with key ${key}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[j] > key) {
        swaps++;
        accesses += 2;
        arr[j + 1] = arr[j];

        steps.push({
          array: [...arr],
          indices: [j + 1],
          stateType: 'swap',
          sortedIndices: Array.from(sortedIndices),
          codeLine: 4,
          description: `Shifted element ${arr[j]} right from index ${j} to ${j + 1}`,
          stats: { comparisons, swaps, accesses, step: steps.length }
        });

        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    accesses++;

    for (let k = 0; k <= i; k++) {
      sortedIndices.add(k);
    }

    steps.push({
      array: [...arr],
      indices: [j + 1],
      stateType: 'sorted',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 6,
      description: `Inserted key ${key} at position ${j + 1}. Prefix [0..${i}] is now sorted.`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });
  }

  for (let k = 0; k < n; k++) sortedIndices.add(k);
  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 6,
    description: `Insertion Sort complete! Performed ${comparisons} comparisons and ${swaps} shifts.`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
