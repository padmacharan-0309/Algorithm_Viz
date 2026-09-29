/* ==========================================================================
   ALGO VIZ - Constants & Algorithm Metadata
   ========================================================================== */

export const CATEGORIES = {
  SORTING: 'sorting',
  SEARCHING: 'searching',
  GRAPH: 'graph'
};

export const ALGORITHM_METADATA = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: CATEGORIES.SORTING,
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. It continues until no swaps are needed (early termination).',
    howItWorks: 'During each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array. The early termination optimization stops the algorithm immediately if a full pass completes without any swaps.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pseudocode: [
      'for i = 0 to n - 1:',
      '    swapped = false',
      '    for j = 0 to n - i - 2:',
      '        if array[j] > array[j + 1]:',
      '            swap(array[j], array[j + 1])',
      '            swapped = true',
      '    if not swapped: break  // Early termination'
    ]
  },

  'selection-sort': {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: CATEGORIES.SORTING,
    description: 'Selection Sort divides the array into a sorted and an unsorted region. In each iteration, it finds the smallest element from the unsorted region and swaps it into the beginning.',
    howItWorks: 'Maintains a pointer to the minimum element scanned so far in the unsorted suffix. Once the entire unsorted portion has been scanned, it performs at most one swap per outer iteration.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    pseudocode: [
      'for i = 0 to n - 1:',
      '    min_idx = i',
      '    for j = i + 1 to n - 1:',
      '        if array[j] < array[min_idx]:',
      '            min_idx = j',
      '    if min_idx != i:',
      '        swap(array[i], array[min_idx])'
    ]
  },

  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: CATEGORIES.SORTING,
    description: 'Insertion Sort builds the final sorted array one element at a time by repeatedly taking the next element and inserting it into its correct position within the already sorted prefix.',
    howItWorks: 'Picks the element array[i] as the current key, shifts all elements greater than key to the right by one position, and places the key in the vacant slot. Extremely efficient for small or nearly sorted arrays.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pseudocode: [
      'for i = 1 to n - 1:',
      '    key = array[i]',
      '    j = i - 1',
      '    while j >= 0 and array[j] > key:',
      '        array[j + 1] = array[j]  // shift right',
      '        j = j - 1',
      '    array[j + 1] = key'
    ]
  },

  'merge-sort': {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: CATEGORIES.SORTING,
    description: 'Merge Sort is an efficient, comparison-based, divide-and-conquer algorithm. It divides the unsorted list into n sublists, each containing one element, then repeatedly merges sublists to produce new sorted sublists.',
    howItWorks: 'Recursively splits the array into two halves until subarrays have size 1. Then merges the sorted halves back together in order using auxiliary storage, ensuring consistent O(n log n) performance.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '    if left >= right: return',
      '    mid = floor((left + right) / 2)',
      '    mergeSort(arr, left, mid)',
      '    mergeSort(arr, mid + 1, right)',
      '    merge(arr, left, mid, right)',
      '// merge combines two sorted halves in order'
    ]
  },

  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: CATEGORIES.SORTING,
    hasPivotStrategy: true,
    description: 'Quick Sort is a highly efficient divide-and-conquer algorithm. It selects a pivot element and partitions the array such that elements smaller than the pivot go left, and elements greater go right.',
    howItWorks: 'Chooses a pivot (First, Last, or Random). Iterates through the partition placing smaller elements before the pivot boundary, then places the pivot in its permanent sorted spot and recurses on left and right segments.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    pseudocode: [
      'function quickSort(arr, low, high):',
      '    if low < high:',
      '        p = partition(arr, low, high)',
      '        quickSort(arr, low, p - 1)',
      '        quickSort(arr, p + 1, high)',
      'function partition(arr, low, high):',
      '    pivot = choosePivot(arr, low, high)',
      '    swap(arr[pivot], arr[high])',
      '    i = low - 1',
      '    for j = low to high - 1:',
      '        if arr[j] <= arr[high]:',
      '            i = i + 1; swap(arr[i], arr[j])',
      '    swap(arr[i + 1], arr[high])',
      '    return i + 1'
    ]
  },

  'heap-sort': {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: CATEGORIES.SORTING,
    description: 'Heap Sort is a comparison-based sorting algorithm that uses a Binary Max-Heap data structure to find the maximum element repeatedly.',
    howItWorks: 'First transforms the array into a Max-Heap in O(n) time. Then repeatedly swaps the root (maximum element) with the last element of the heap, shrinks heap size by 1, and restores the heap property via sift-down (heapify).',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    pseudocode: [
      'buildMaxHeap(array, n)',
      'for i = n - 1 down to 1:',
      '    swap(array[0], array[i]) // move max to end',
      '    heapify(array, i, 0)     // sift down root',
      'function heapify(arr, size, root):',
      '    largest = root, left = 2*root+1, right = 2*root+2',
      '    if left < size and arr[left] > arr[largest]: largest = left',
      '    if right < size and arr[right] > arr[largest]: largest = right',
      '    if largest != root: swap and heapify(largest)'
    ]
  },

  'linear-search': {
    id: 'linear-search',
    name: 'Linear Search',
    category: CATEGORIES.SEARCHING,
    needsTarget: true,
    description: 'Linear Search is the simplest search algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched.',
    howItWorks: 'Starts from the first element at index 0 and compares each element with the target value. Requires no sorting or preconditions. Terminates as soon as the target is found.',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pseudocode: [
      'for i = 0 to n - 1:',
      '    if array[i] == target:',
      '        return i  // Target found at index i',
      'return -1        // Target not found'
    ]
  },

  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: CATEGORIES.SEARCHING,
    needsTarget: true,
    requiresSorted: true,
    description: 'Binary Search is an extremely fast search algorithm that operates on sorted arrays by repeatedly halving the search interval.',
    howItWorks: 'Compares the target with the middle element. If target equals mid, search completes. If target is less than mid, narrow search to the left half (high = mid - 1); otherwise narrow to the right half (low = mid + 1). Eliminates half the remaining elements each step.',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '    mid = floor((low + high) / 2)',
      '    if array[mid] == target:',
      '        return mid  // Found!',
      '    else if array[mid] < target:',
      '        low = mid + 1  // Eliminate left half',
      '    else:',
      '        high = mid - 1 // Eliminate right half',
      'return -1  // Not found'
    ]
  },

  'bfs': {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: CATEGORIES.GRAPH,
    isGraph: true,
    description: 'Breadth-First Search explores graph vertices level by level, visiting all immediate neighbors of a vertex before moving to their children, using a First-In-First-Out (FIFO) Queue.',
    howItWorks: 'Enqueues the starting node and marks it visited. While queue is not empty, dequeues the front node, examines all unvisited outgoing neighbors, records edges, and adds unvisited neighbors to the queue. Finds shortest path in unweighted graphs.',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    stable: true,
    inPlace: false,
    pseudocode: [
      'queue = [startNode], visited = {startNode}',
      'while queue is not empty:',
      '    current = queue.shift()',
      '    process(current)',
      '    for each neighbor of current:',
      '        if neighbor not in visited:',
      '            visited.add(neighbor)',
      '            parent[neighbor] = current',
      '            queue.push(neighbor)'
    ]
  },

  'dfs': {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: CATEGORIES.GRAPH,
    isGraph: true,
    description: 'Depth-First Search explores a graph by traveling as deep as possible along each branch before backtracking, utilizing a Last-In-First-Out (LIFO) Stack or call recursion.',
    howItWorks: 'Starts at the root node, visits an unvisited neighbor, and continues descending along that path until a dead end or visited node is encountered, then backtracks to explore alternate branches.',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    stable: false,
    inPlace: false,
    pseudocode: [
      'function dfs(node, visited):',
      '    visited.add(node)',
      '    process(node)',
      '    for each neighbor of node:',
      '        if neighbor not in visited:',
      '            dfs(neighbor, visited)  // Recurse deeper',
      '    // Backtrack'
    ]
  },

  'dijkstra': {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: CATEGORIES.GRAPH,
    isGraph: true,
    description: "Dijkstra's algorithm finds the shortest paths from a single source node to all other nodes in a weighted graph with non-negative edge weights.",
    howItWorks: 'Initializes distance to source as 0 and all others as infinity. Repeatedly selects the unvisited node with the smallest tentative distance, relaxes all of its outgoing edges (updating distances if a shorter path is found), and marks the node as settled.',
    timeComplexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)'
    },
    spaceComplexity: 'O(V)',
    stable: true,
    inPlace: false,
    pseudocode: [
      'dist[source] = 0, for others dist[v] = ∞',
      'unvisited = all nodes',
      'while unvisited is not empty:',
      '    u = unvisited node with min dist[u]',
      '    unvisited.remove(u)',
      '    for each neighbor v of u:',
      '        alt = dist[u] + weight(u, v)',
      '        if alt < dist[v]:',
      '            dist[v] = alt; parent[v] = u'
    ]
  }
};

export const DEFAULTS = {
  ALGORITHM: 'bubble-sort',
  ARRAY_SIZE: 30,
  MIN_ARRAY_SIZE: 5,
  MAX_ARRAY_SIZE: 100,
  MIN_VALUE: 5,
  MAX_VALUE: 100,
  SPEED_MULTIPLIER: 1, // 1x default
  PIVOT_STRATEGY: 'random',
  THEME: 'dark'
};

export const SPEED_PRESETS = [
  { label: '0.25x', factor: 0.25, baseDelay: 480 },
  { label: '0.5x', factor: 0.5, baseDelay: 240 },
  { label: '1x', factor: 1.0, baseDelay: 120 },
  { label: '1.5x', factor: 1.5, baseDelay: 80 },
  { label: '2x', factor: 2.0, baseDelay: 50 },
  { label: '4x', factor: 4.0, baseDelay: 20 }
];
