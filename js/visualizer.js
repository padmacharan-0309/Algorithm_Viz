/* ==========================================================================
   ALGO VIZ - Visualizer Engine & Rendering
   Handles Sorting bars, Searching cells, Graph SVG, and playback loop
   ========================================================================== */

import { stateStore } from './state.js';
import { CATEGORIES, SPEED_PRESETS } from './utils/constants.js';
import { $, $$, sound } from './utils/helpers.js';

// Algorithm Step Generators
import { generateBubbleSortSteps } from './algorithms/bubbleSort.js';
import { generateSelectionSortSteps } from './algorithms/selectionSort.js';
import { generateInsertionSortSteps } from './algorithms/insertionSort.js';
import { generateMergeSortSteps } from './algorithms/mergeSort.js';
import { generateQuickSortSteps } from './algorithms/quickSort.js';
import { generateHeapSortSteps } from './algorithms/heapSort.js';
import { generateLinearSearchSteps } from './algorithms/linearSearch.js';
import { generateBinarySearchSteps } from './algorithms/binarySearch.js';
import { generateBFSSteps } from './algorithms/bfs.js';
import { generateDFSSteps } from './algorithms/dfs.js';
import { generateDijkstraSteps } from './algorithms/dijkstra.js';

export class VisualizerEngine {
  constructor() {
    this.animationTimer = null;
    this.stageBody = null;
    this.dragNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.elapsedStart = 0;
  }

  init() {
    this.stageBody = $('#stage-body');
    this.recomputeSteps();
    this.renderCurrentStep();
  }

  /**
   * Recompute step-by-step trace based on current algorithm and input data
   */
  recomputeSteps() {
    const s = stateStore.get();
    let steps = [];

    switch (s.algorithmId) {
      case 'bubble-sort':
        steps = generateBubbleSortSteps(s.array);
        break;
      case 'selection-sort':
        steps = generateSelectionSortSteps(s.array);
        break;
      case 'insertion-sort':
        steps = generateInsertionSortSteps(s.array);
        break;
      case 'merge-sort':
        steps = generateMergeSortSteps(s.array);
        break;
      case 'quick-sort':
        steps = generateQuickSortSteps(s.array, { pivotStrategy: s.pivotStrategy });
        break;
      case 'heap-sort':
        steps = generateHeapSortSteps(s.array);
        break;
      case 'linear-search':
        steps = generateLinearSearchSteps(s.array, { target: s.searchTarget });
        break;
      case 'binary-search':
        steps = generateBinarySearchSteps(s.array, { target: s.searchTarget });
        break;
      case 'bfs':
        steps = generateBFSSteps(s.graph, { startNodeId: s.graphSource, targetNodeId: s.graphTarget });
        break;
      case 'dfs':
        steps = generateDFSSteps(s.graph, { startNodeId: s.graphSource, targetNodeId: s.graphTarget });
        break;
      case 'dijkstra':
        steps = generateDijkstraSteps(s.graph, { startNodeId: s.graphSource, targetNodeId: s.graphTarget });
        break;
      default:
        steps = generateBubbleSortSteps(s.array);
    }

    stateStore.set({
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      elapsedTime: 0
    });
  }

  /**
   * Get delay per frame in milliseconds based on current speedMultiplier
   */
  getStepDelay() {
    const mult = stateStore.get().speedMultiplier;
    // Base 120ms at 1x
    return Math.max(15, Math.round(120 / mult));
  }

  play() {
    const s = stateStore.get();
    if (s.isPlaying) return;

    if (s.currentStepIndex >= s.steps.length - 1) {
      // Reached the end, restart from beginning
      stateStore.set({ currentStepIndex: 0, isCompleted: false });
    }

    stateStore.set({ isPlaying: true, isPaused: false });
    this.elapsedStart = performance.now();
    this.scheduleNextFrame();
  }

  pause() {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
    stateStore.set({ isPlaying: false, isPaused: true });
  }

  reset() {
    this.pause();
    stateStore.set({
      currentStepIndex: 0,
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      elapsedTime: 0
    });
    this.renderCurrentStep();
  }

  stepForward() {
    this.pause();
    const s = stateStore.get();
    if (s.currentStepIndex < s.steps.length - 1) {
      stateStore.set({ currentStepIndex: s.currentStepIndex + 1 });
      this.renderCurrentStep();
    }
  }

  stepBackward() {
    this.pause();
    const s = stateStore.get();
    if (s.currentStepIndex > 0) {
      stateStore.set({ currentStepIndex: s.currentStepIndex - 1 });
      this.renderCurrentStep();
    }
  }

  jumpToStep(stepIdx) {
    this.pause();
    const s = stateStore.get();
    const targetIdx = Math.max(0, Math.min(stepIdx, s.steps.length - 1));
    stateStore.set({ currentStepIndex: targetIdx });
    this.renderCurrentStep();
  }

  scheduleNextFrame() {
    const delay = this.getStepDelay();
    this.animationTimer = setTimeout(() => {
      const s = stateStore.get();
      if (!s.isPlaying) return;

      if (s.currentStepIndex < s.steps.length - 1) {
        stateStore.set({ currentStepIndex: s.currentStepIndex + 1 });
        this.renderCurrentStep();
        this.scheduleNextFrame();
      } else {
        // Complete!
        stateStore.set({ isPlaying: false, isPaused: false, isCompleted: true });
        sound.playSuccess();
      }
    }, delay);
  }

  /**
   * Main render dispatch for the current step
   */
  renderCurrentStep() {
    const s = stateStore.get();
    const currentStep = s.steps[s.currentStepIndex];
    if (!currentStep) return;

    // Play subtle audio cue
    if (currentStep.stateType === 'compare') {
      sound.playCompare(currentStep.indices && currentStep.indices[0] ? currentStep.array[currentStep.indices[0]] : 50);
    } else if (currentStep.stateType === 'swap') {
      sound.playSwap(currentStep.indices && currentStep.indices[0] ? currentStep.array[currentStep.indices[0]] : 50);
    }

    if (s.category === CATEGORIES.SORTING) {
      this.renderSortingBars(currentStep);
    } else if (s.category === CATEGORIES.SEARCHING) {
      this.renderSearchingCards(currentStep);
    } else if (s.category === CATEGORIES.GRAPH) {
      this.renderGraph(currentStep);
    }

    // Update synchronized UI elements
    this.updateStepInfo(currentStep, s);
  }

  /**
   * Render Vertical Bars for Sorting Algorithms
   */
  renderSortingBars(step) {
    if (!this.stageBody) return;

    let container = $('#bars-container');
    if (!container) {
      this.stageBody.innerHTML = '<div id="bars-container" class="bars-container"></div>';
      container = $('#bars-container');
    }

    const arr = step.array;
    const maxVal = Math.max(...arr, 100);
    const sortedSet = new Set(step.sortedIndices || []);
    const activeIndices = new Set(step.indices || []);
    const showValues = arr.length <= 40;

    // Check if bar elements count matches, reuse DOM nodes for peak performance
    let bars = $$('.bar-item', container);
    if (bars.length !== arr.length) {
      container.innerHTML = '';
      for (let i = 0; i < arr.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar-item';
        bar.id = `bar-${i}`;
        if (showValues) {
          bar.innerHTML = `<span class="bar-value">${arr[i]}</span><span class="bar-index">${i}</span>`;
        }
        container.appendChild(bar);
      }
      bars = $$('.bar-item', container);
    }

    // Update bars heights and visual state classes
    for (let i = 0; i < arr.length; i++) {
      const bar = bars[i];
      const val = arr[i];
      const heightPercent = Math.max(6, (val / maxVal) * 94);
      bar.style.height = `${heightPercent}%`;

      if (showValues) {
        const valSpan = bar.querySelector('.bar-value');
        if (valSpan && valSpan.textContent !== String(val)) {
          valSpan.textContent = val;
        }
      }

      // Reset classes
      bar.className = 'bar-item';

      if (activeIndices.has(i)) {
        if (step.stateType === 'compare') {
          bar.classList.add('state-compare');
        } else if (step.stateType === 'swap') {
          bar.classList.add('state-swap');
        } else if (step.stateType === 'pivot') {
          bar.classList.add('state-pivot');
        } else if (step.stateType === 'key') {
          bar.classList.add('state-key');
        }
      } else if (sortedSet.has(i)) {
        bar.classList.add('state-sorted');
      }
    }
  }

  /**
   * Render Searching Cards for Linear & Binary Search
   */
  renderSearchingCards(step) {
    if (!this.stageBody) return;

    let container = $('#search-container');
    if (!container) {
      this.stageBody.innerHTML = '<div id="search-container" class="search-array-container"></div>';
      container = $('#search-container');
    }

    const arr = step.array;
    const activeIndices = new Set(step.indices || []);
    const eliminatedSet = new Set(step.eliminatedIndices || []);
    const pointers = step.pointers || {};

    let cells = $$('.search-cell', container);
    if (cells.length !== arr.length) {
      container.innerHTML = '';
      for (let i = 0; i < arr.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'search-cell';
        cell.id = `search-cell-${i}`;
        cell.innerHTML = `
          <div class="search-pointer-badge"></div>
          <span class="search-cell-value">${arr[i]}</span>
          <span class="search-cell-index">[${i}]</span>
        `;
        container.appendChild(cell);
      }
      cells = $$('.search-cell', container);
    }

    for (let i = 0; i < arr.length; i++) {
      const cell = cells[i];
      const val = arr[i];
      const valSpan = cell.querySelector('.search-cell-value');
      if (valSpan && valSpan.textContent !== String(val)) {
        valSpan.textContent = val;
      }

      cell.className = 'search-cell';
      const badge = cell.querySelector('.search-pointer-badge');
      badge.textContent = '';
      badge.className = 'search-pointer-badge';

      if (pointers.found === i) {
        cell.classList.add('state-found');
        badge.textContent = 'FOUND';
        badge.classList.add('low');
      } else if (activeIndices.has(i)) {
        cell.classList.add('state-searching');
      } else if (eliminatedSet.has(i)) {
        cell.classList.add('state-eliminated');
      }

      // Pointer badges for Binary Search
      if (pointers.low === i && pointers.high === i) {
        badge.textContent = 'L=H';
        badge.classList.add('low');
      } else if (pointers.mid === i) {
        badge.textContent = 'MID';
        badge.classList.add('mid');
      } else if (pointers.low === i) {
        badge.textContent = 'LOW';
        badge.classList.add('low');
      } else if (pointers.high === i) {
        badge.textContent = 'HIGH';
        badge.classList.add('high');
      }
    }
  }

  /**
   * Render Interactive Graph (BFS, DFS, Dijkstra)
   */
  renderGraph(step) {
    if (!this.stageBody) return;

    let graphContainer = $('#graph-container');
    if (!graphContainer) {
      this.stageBody.innerHTML = `
        <div id="graph-container" class="graph-stage-container">
          <svg id="graph-svg" class="graph-svg"></svg>
          <div id="graph-aux" class="graph-aux-panel"></div>
        </div>
      `;
      graphContainer = $('#graph-container');
      this.attachGraphInteractions();
    }

    const svg = $('#graph-svg');
    const aux = $('#graph-aux');
    const s = stateStore.get();
    const graph = s.graph;

    const visitedNodes = new Set(step.visitedNodes || []);
    const currentNode = step.currentNode;
    const activeEdges = step.activeEdges || [];
    const shortestPathEdges = step.shortestPathEdges || [];

    // Helper to test if edge is active or in shortest path
    const isEdgeInList = (u, v, list) => {
      return list.some(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
    };

    // Render Edges
    let edgesHtml = '';
    graph.edges.forEach(e => {
      const fromNode = graph.nodes.find(n => n.id === e.from);
      const toNode = graph.nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;

      const isActive = isEdgeInList(e.from, e.to, activeEdges);
      const isPath = isEdgeInList(e.from, e.to, shortestPathEdges);
      let edgeClass = 'graph-edge';
      if (isPath) edgeClass += ' path';
      else if (isActive) edgeClass += ' active';

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;

      edgesHtml += `
        <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" class="${edgeClass}" />
        <text x="${midX}" y="${midY}" class="edge-weight-label">${e.weight || ''}</text>
      `;
    });

    // Render Nodes
    let nodesHtml = '';
    graph.nodes.forEach(n => {
      let fillColor = 'var(--bg-tertiary)';
      let strokeColor = 'var(--border-strong)';
      let strokeWidth = '2';

      if (n.id === currentNode) {
        fillColor = 'var(--state-swap)';
        strokeColor = '#fff';
        strokeWidth = '3.5';
      } else if (n.id === s.graphSource) {
        fillColor = 'var(--accent-primary)';
        strokeColor = 'var(--accent-secondary)';
      } else if (n.id === s.graphTarget && shortestPathEdges.length > 0) {
        fillColor = 'var(--state-sorted)';
      } else if (visitedNodes.has(n.id)) {
        fillColor = 'var(--state-visited)';
      }

      nodesHtml += `
        <g class="graph-node-group" data-id="${n.id}" transform="translate(${n.x}, ${n.y})">
          <circle r="22" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" class="graph-node" />
          <text dy=".3em">${n.label}</text>
        </g>
      `;
    });

    svg.innerHTML = edgesHtml + nodesHtml;

    // Render Aux Panel (Queue for BFS, Stack for DFS, Distance Table for Dijkstra)
    if (s.algorithmId === 'bfs') {
      const q = step.queue || [];
      aux.innerHTML = `
        <div class="graph-aux-title">BFS Queue (FIFO)</div>
        <div class="aux-queue-display">
          ${q.length ? q.map(item => `<span class="aux-queue-item">[${item}]</span>`).join(' → ') : '<span style="color:var(--text-muted)">Empty</span>'}
        </div>
      `;
    } else if (s.algorithmId === 'dfs') {
      const stk = step.stack || [];
      aux.innerHTML = `
        <div class="graph-aux-title">DFS Call Stack (LIFO)</div>
        <div class="aux-queue-display">
          ${stk.length ? stk.map(item => `<span class="aux-queue-item">[${item}]</span>`).join(' → ') : '<span style="color:var(--text-muted)">Empty</span>'}
        </div>
      `;
    } else if (s.algorithmId === 'dijkstra') {
      const dists = step.distances || {};
      const parents = step.parent || {};
      let rows = '';
      graph.nodes.forEach(n => {
        const d = dists[n.id] === Infinity ? '∞' : dists[n.id];
        const p = parents[n.id] || '-';
        const isCurrent = n.id === currentNode;
        rows += `
          <tr class="${isCurrent ? 'active' : ''}">
            <td><strong>${n.id}</strong></td>
            <td>${d}</td>
            <td>${p}</td>
          </tr>
        `;
      });
      aux.innerHTML = `
        <div class="graph-aux-title">Dijkstra Distances</div>
        <table class="aux-table">
          <thead><tr><th>Node</th><th>Distance</th><th>Previous</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  }

  /**
   * Drag & drop interaction for graph nodes
   */
  attachGraphInteractions() {
    const svg = $('#graph-svg');
    if (!svg) return;

    svg.addEventListener('mousedown', (e) => {
      const group = e.target.closest('.graph-node-group');
      if (group) {
        const id = group.getAttribute('data-id');
        const s = stateStore.get();
        const node = s.graph.nodes.find(n => n.id === id);
        if (node) {
          const rect = svg.getBoundingClientRect();
          this.dragNode = node;
          this.dragOffset = {
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y
          };
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.dragNode && svg) {
        const rect = svg.getBoundingClientRect();
        this.dragNode.x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left - this.dragOffset.x));
        this.dragNode.y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top - this.dragOffset.y));
        this.renderCurrentStep();
      }
    });

    window.addEventListener('mouseup', () => {
      this.dragNode = null;
    });
  }

  /**
   * Synchronize top banner, timeline slider, stats counters, and pseudocode line
   */
  updateStepInfo(step, s) {
    // Current Action text
    const actionEl = $('#stage-action-text');
    if (actionEl) {
      actionEl.innerHTML = `<span class="stage-action-prefix">STEP ${s.currentStepIndex + 1}/${s.steps.length}:</span> ${step.description}`;
    }

    // Timeline Slider
    const timeline = $('#timeline-slider');
    const stepLabel = $('#timeline-step-label');
    if (timeline && s.steps.length > 0) {
      timeline.max = s.steps.length - 1;
      timeline.value = s.currentStepIndex;
    }
    if (stepLabel) {
      stepLabel.textContent = `${s.currentStepIndex + 1} / ${s.steps.length}`;
    }

    // Status Dot
    const statusDot = $('#status-dot');
    const statusText = $('#status-text');
    if (statusDot && statusText) {
      if (s.isPlaying) {
        statusDot.className = 'status-dot running';
        statusText.textContent = 'Running';
      } else if (s.isPaused) {
        statusDot.className = 'status-dot paused';
        statusText.textContent = 'Paused';
      } else if (s.isCompleted) {
        statusDot.className = 'status-dot completed';
        statusText.textContent = 'Completed';
      } else {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Ready';
      }
    }

    // Pseudocode line highlight
    $$('.code-line').forEach((el, idx) => {
      if (idx === step.codeLine) {
        el.classList.add('active');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('active');
      }
    });

    // Update Statistics Cards
    this.updateStatsCards(step, s);
  }

  updateStatsCards(step, s) {
    const stat1Val = $('#stat-1-val');
    const stat1Label = $('#stat-1-label');
    const stat2Val = $('#stat-2-val');
    const stat2Label = $('#stat-2-label');
    const stat3Val = $('#stat-3-val');
    const stat3Label = $('#stat-3-label');
    const stat4Val = $('#stat-4-val');
    const stat4Label = $('#stat-4-label');

    if (s.category === CATEGORIES.SORTING || s.category === CATEGORIES.SEARCHING) {
      if (stat1Label) stat1Label.textContent = 'Comparisons';
      if (stat1Val) stat1Val.textContent = step.stats.comparisons;

      if (stat2Label) stat2Label.textContent = s.category === CATEGORIES.SORTING ? 'Swaps / Shifts' : 'Target';
      if (stat2Val) stat2Val.textContent = s.category === CATEGORIES.SORTING ? step.stats.swaps : s.searchTarget;

      if (stat3Label) stat3Label.textContent = 'Array Accesses';
      if (stat3Val) stat3Val.textContent = step.stats.accesses;

      if (stat4Label) stat4Label.textContent = 'Step / Total';
      if (stat4Val) stat4Val.textContent = `${s.currentStepIndex + 1} / ${s.steps.length}`;
    } else if (s.category === CATEGORIES.GRAPH) {
      if (stat1Label) stat1Label.textContent = 'Nodes Visited';
      if (stat1Val) stat1Val.textContent = step.stats.visitedCount;

      if (stat2Label) stat2Label.textContent = 'Edges Checked';
      if (stat2Val) stat2Val.textContent = step.stats.edgesChecked;

      if (stat3Label) stat3Label.textContent = 'Current Node';
      if (stat3Val) stat3Val.textContent = step.stats.currentNode || '-';

      if (stat4Label) stat4Label.textContent = 'Distance / Step';
      if (stat4Val) stat4Val.textContent = `${step.stats.currentDistance !== undefined ? step.stats.currentDistance : s.currentStepIndex + 1}`;
    }
  }
}

export const visualizer = new VisualizerEngine();
