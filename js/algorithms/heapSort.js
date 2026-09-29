/* ==========================================================================
   ALGO VIZ - Heap Sort Implementation
   ========================================================================== */

export function generateHeapSortSteps(initialArray) {
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
    description: 'Starting Heap Sort. Step 1: Building initial Binary Max-Heap.',
    stats: { comparisons, swaps, accesses, step: 0 }
  });

  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      comparisons++;
      accesses += 2;
      steps.push({
        array: [...arr],
        indices: [root, left],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 5,
        description: `Comparing parent A[${root}] = ${arr[root]} with left child A[${left}] = ${arr[left]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      accesses += 2;
      steps.push({
        array: [...arr],
        indices: [largest, right],
        stateType: 'compare',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 6,
        description: `Comparing largest candidate A[${largest}] = ${arr[largest]} with right child A[${right}] = ${arr[right]}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      swaps++;
      accesses += 4;
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;

      steps.push({
        array: [...arr],
        indices: [root, largest],
        stateType: 'swap',
        sortedIndices: Array.from(sortedIndices),
        codeLine: 7,
        description: `Heapify swap: moved larger child ${arr[root]} up to parent position ${root}`,
        stats: { comparisons, swaps, accesses, step: steps.length }
      });

      heapify(size, largest);
    }
  }

  // Phase 1: Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      indices: [i],
      stateType: 'pivot',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 0,
      description: `Building Max-Heap: Heapifying subtree rooted at index ${i}`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    indices: [0],
    stateType: 'key',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 1,
    description: 'Max-Heap constructed! Root element A[0] is guaranteed maximum.',
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  // Phase 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root (maximum) to current end
    swaps++;
    accesses += 4;
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.add(i);

    steps.push({
      array: [...arr],
      indices: [0, i],
      stateType: 'swap',
      sortedIndices: Array.from(sortedIndices),
      codeLine: 2,
      description: `Extracted maximum ${arr[i]} from root to sorted index ${i}`,
      stats: { comparisons, swaps, accesses, step: steps.length }
    });

    // Heapify the root on reduced heap
    heapify(i, 0);
  }

  sortedIndices.add(0);

  steps.push({
    array: [...arr],
    indices: [],
    stateType: 'sorted',
    sortedIndices: Array.from(sortedIndices),
    codeLine: 7,
    description: `Heap Sort complete! Sorted in ${comparisons} comparisons and ${swaps} swaps.`,
    stats: { comparisons, swaps, accesses, step: steps.length }
  });

  return steps;
}
