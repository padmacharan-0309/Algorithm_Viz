/* ==========================================================================
   ALGO VIZ - Random Data & Graph Generators
   ========================================================================== */

/**
 * Generate a random integer between min and max inclusive
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a uniformly random array of numbers
 */
export function generateRandomArray(size = 30, min = 5, max = 100) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(getRandomInt(min, max));
  }
  return arr;
}

/**
 * Generate a nearly sorted array (90% sorted with a few swaps)
 */
export function generateNearlySortedArray(size = 30) {
  const arr = [];
  const step = 95 / size;
  for (let i = 0; i < size; i++) {
    arr.push(Math.round(5 + i * step));
  }
  // Perform 2 to 4 small random swaps
  const numSwaps = Math.max(1, Math.floor(size * 0.1));
  for (let k = 0; k < numSwaps; k++) {
    const idx1 = getRandomInt(0, size - 1);
    const idx2 = clamp(idx1 + getRandomInt(-3, 3), 0, size - 1);
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  }
  return arr;
}

/**
 * Generate a reversed array
 */
export function generateReversedArray(size = 30) {
  const arr = [];
  const step = 95 / size;
  for (let i = 0; i < size; i++) {
    arr.push(Math.round(100 - i * step));
  }
  return arr;
}

/**
 * Generate an array with few unique numbers (lots of duplicates)
 */
export function generateFewUniqueArray(size = 30) {
  const candidates = [15, 35, 55, 75, 95];
  const arr = [];
  for (let i = 0; i < size; i++) {
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    arr.push(pick);
  }
  return arr;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Get a default sample graph with nicely distributed nodes and weighted edges
 */
export function getSampleGraph() {
  return {
    nodes: [
      { id: 'A', label: 'A', x: 100, y: 180 },
      { id: 'B', label: 'B', x: 230, y: 80 },
      { id: 'C', label: 'C', x: 230, y: 280 },
      { id: 'D', label: 'D', x: 420, y: 80 },
      { id: 'E', label: 'E', x: 420, y: 280 },
      { id: 'F', label: 'F', x: 550, y: 180 }
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 3 }
    ]
  };
}
