/* ==========================================================================
   ALGO VIZ - Quick Sort Implementation
   Supports First, Last, and Random pivot strategies
   ========================================================================== */

export function generateQuickSortSteps(initialArray, { pivotStrategy = 'random' } = {}) {
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
    description: `Starting Quick Sort with [${pivotStrategy.toUpperCase()}] pivot strategy.`,
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  function choosePivotIndex(low, high) {
    if (pivotStrategy === 'first') return low;
    if (pivotStrategy === 'last') return high;
    // Default: random
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  function partition(low, high) {
    const pivotIdx = choosePivotIndex(low, high);
    const pivotVal = arr[pivotIdx];

    // Swap chosen pivot to high
    if (pivotIdx !== high) {
      swaps++;
      accesses += 4;
      const temp = arr[pivotIdx];
      arr[pivotIdx] = arr[high];
      arr[high] = temp;
    }

    steps.push({
      array: [...arr],
      indices: [high],
      stateType: 'pivot',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 6,
      description: `Partitioning range [${low}..${high}]. Selected pivot: A[${high}] = ${arr[high]}`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...arr],
        indices: [j, high],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 9,
        description: `Comparing A[${j}] = ${arr[j]} with pivot ${arr[high]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[j] <= arr[high]) {
        i++;
        if (i !== j) {
          swaps++;
          accesses += 4;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            array: [...arr],
            indices: [i, j],
            stateType: 'swap',
            sortedIndices: Array.from(sortedIndices),
            codeLine: 10,
            description: `Swapped smaller element ${arr[i]} into left partition at index ${i}`,
            stats: { comparisons, swaps, accesses, step: steps.length }
          });
        }
      }
    }

    // Place pivot in correct slot
    const finalPivotIdx = i + 1;
    if (finalPivotIdx !== high) {
      swaps++;
      accesses += 4;
      const temp = arr[finalPivotIdx];
      arr[finalPivotIdx] = arr[high];
      arr[high] = temp;
    }

    sortedIndices.add(finalPivotIdx);

    steps.push({
      array: [...arr],
      indices: [finalPivotIdx],
      stateType: 'sorted',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 11,
      description: `Pivot ${arr[finalPivotIdx]} placed in its final sorted position at index ${finalPivotIdx}`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    return finalPivotIdx;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const p = partition(low, high);
      quickSortHelper(low, p - 1);
      quickSortHelper(p + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  quickSortHelper(0, n - 1);

  for (let k = 0; k < n; k++) sortedIndices.add(k);
  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 4,
    description: `Quick Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
