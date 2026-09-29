# ALGO VIZ — Production-Quality Interactive Algorithm Visualizer

An interactive, responsive, developer-portfolio standard Algorithm Visualizer web application built with pure **HTML5, CSS3, and vanilla JavaScript (ES6+)**.

---

## 🌟 Overview

**ALGO VIZ** is designed to transform abstract computer science concepts into tangible, visual mechanics. Rather than memorizing asymptotic complexity tables, users can observe comparisons, memory swaps, partition boundaries, stack frames, and graph edge relaxations in real time with line-by-line synchronized pseudocode and deterministic timeline scrubbing.

Zero frameworks. Zero build steps. Fully client-side, accessible, and fast.

---

## 🚀 Key Features

* **3 Algorithm Categories:**
  * **Sorting:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
  * **Searching:** Linear Search, Binary Search
  * **Graph Algorithms:** Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path
* **Deterministic Step Engine:**
  * Execute step-by-step with **Next Step (→)** and **Previous Step (←)**
  * Play / Pause / Reset with smooth transitions
  * Instant Timeline Scrubber slider to jump to any operation instantly
* **Line-by-Line Synchronized Pseudocode:**
  * Displays clean pseudocode for each algorithm
  * Real-time line highlighting synchronized with each atomic operation
  * Human-readable step explanations (e.g. `Comparing A[3] = 8 and A[4] = 5`, `Relaxed edge (B — C)`)
* **Interactive Graph Canvas:**
  * Drag-and-drop node positioning
  * Weighted edges with visual collision avoidance
  * Auxiliary visual displays: FIFO Queue for BFS, LIFO Call Stack for DFS, and Tentative Distance Table for Dijkstra
* **Flexible Input Controls:**
  * Uniform random array generator
  * Distribution presets: **Random**, **Reversed**, **Nearly Sorted**, **Few Unique (Duplicates)**
  * Custom manual input with strict format validation and friendly toast feedback
  * Adjustable array size (5 to 80 elements)
  * Quick Sort pivot strategy selector: **Random**, **First**, **Last**
  * Search target selector
* **Dynamic Speed Control:**
  * Granular slider from 0.25x to 4x
  * Quick-select chips (0.25x, 0.5x, 1x, 1.5x, 2x, 4x)
* **Comprehensive Live Statistics:**
  * Comparisons counter
  * Swaps and element shifts
  * Array memory accesses
  * Graph nodes visited, edges checked, current distance
  * Time and space complexity cards (Best, Average, Worst, Space, In-Place, Stability)
* **Design & UX:**
  * Professional dark developer-tool aesthetic with modern CSS custom properties
  * Dark and Light theme toggle (persisted via `localStorage`)
  * Web Audio API synthesizer feedback for comparisons and swaps (toggleable)
  * Keyboard navigation support
  * Fully responsive across desktop, tablet, and mobile displays

---

## 📚 Supported Algorithms & Complexities

| Category | Algorithm | Best Time | Average Time | Worst Time | Space | Stable | In-Place |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sorting** | Bubble Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes |
| **Sorting** | Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No | Yes |
| **Sorting** | Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes |
| **Sorting** | Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | No |
| **Sorting** | Quick Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No | Yes |
| **Sorting** | Heap Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No | Yes |
| **Searching** | Linear Search | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ | Yes | Yes |
| **Searching** | Binary Search | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ | Yes | Yes |
| **Graph** | BFS | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ | Yes | No |
| **Graph** | DFS | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ | No | No |
| **Graph** | Dijkstra | $O((V+E)\log V)$ | $O((V+E)\log V)$ | $O((V+E)\log V)$ | $O(V)$ | Yes | No |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause visualization |
| <kbd>R</kbd> | Reset to initial state |
| <kbd>→</kbd> | Step forward one operation |
| <kbd>←</kbd> | Step backward one operation |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts help dialog |
| <kbd>Esc</kbd> | Close any open modal or mobile drawer |

---

## 📁 Project Architecture

```text
algorithm-visualizer/
│
├── index.html                  # Semantic HTML5 application shell & modals
├── README.md                   # Project documentation & guides
│
├── css/
│   ├── variables.css           # Design tokens, color system, dark/light themes
│   ├── style.css               # Core layout, dashboard grid, cards, animations
│   └── responsive.css          # Breakpoints for mobile, tablet, and small screens
│
├── js/
│   ├── app.js                  # Entry point bootstrap
│   ├── state.js                # Centralized reactive state store & LocalStorage sync
│   ├── visualizer.js           # Multi-category rendering engine & step playback
│   ├── ui.js                   # DOM interaction controller, modals & keyboard events
│   │
│   ├── algorithms/             # Pure algorithmic step generators
│   │   ├── bubbleSort.js       # Bubble Sort with early termination
│   │   ├── selectionSort.js    # Selection Sort with min-index tracking
│   │   ├── insertionSort.js    # Insertion Sort with key shifting
│   │   ├── mergeSort.js        # Merge Sort with divide & conquer
│   │   ├── quickSort.js        # Quick Sort with First/Last/Random pivot options
│   │   ├── heapSort.js         # Heap Sort with binary max-heap construction
│   │   ├── linearSearch.js     # Sequential scan with target tracking
│   │   ├── binarySearch.js     # Halving search with range elimination
│   │   ├── bfs.js              # Breadth-first traversal with queue display
│   │   ├── dfs.js              # Depth-first traversal with stack display
│   │   └── dijkstra.js         # Dijkstra shortest path with distance relaxation
│   │
│   └── utils/
│       ├── constants.js        # Complexities, pseudocode, defaults, metadata
│       ├── helpers.js          # DOM queries, clamp, toasts, Web Audio synth
│       └── random.js           # Array generation presets and sample graph
│
└── assets/
    └── icons/                  # Application asset icons
```

---

## 🛠️ How to Run Locally

Because the project uses modern ES6 modules (`import`/`export`), it is best served using any simple local HTTP static server:

### Option 1: Python (Built-in)
```bash
# In the project directory:
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Node.js (via npx)
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and choose **"Open with Live Server"**.

---

## 🔬 Software Engineering Design Highlights

1. **Separation of Concerns:**
   Algorithmic logic is completely decoupled from DOM and rendering logic. Every algorithm is a pure generator function receiving input data and returning an immutable array of step snapshots.
2. **Reversible Deterministic Execution:**
   Because steps are captured as discrete states, stepping backward is instant, reliable, and mathematically identical to the previous operation without tricky rollback hacks.
3. **DOM Efficiency & Performance:**
   The rendering engine reuses existing DOM nodes during visualization rather than destroying and rebuilding elements on every frame, achieving silky smooth 60fps animations.
4. **State Persistence:**
   User preferences (theme mode, last selected algorithm, speed, array size) are automatically saved to `localStorage` and restored seamlessly on reload.

---

## 🚀 Future Improvements

* A* Search Algorithm on grid mazes with customizable heuristics
* Minimum Spanning Tree visualizations (Kruskal's & Prim's algorithms)
* Self-balancing Binary Search Trees (AVL & Red-Black trees)
* Graph custom node & edge builder modal
* Side-by-side comparative algorithm race mode
