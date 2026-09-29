/* ==========================================================================
   ALGO VIZ - Reactive Application State
   Centralized state management with LocalStorage persistence
   ========================================================================== */

import { DEFAULTS, ALGORITHM_METADATA } from './utils/constants.js';
import { generateRandomArray, getSampleGraph } from './utils/random.js';

class StateStore {
  constructor() {
    this.listeners = new Map();

    // Load persisted settings or use defaults
    const savedTheme = localStorage.getItem('algoviz_theme') || DEFAULTS.THEME;
    const savedAlgo = localStorage.getItem('algoviz_algo') || DEFAULTS.ALGORITHM;
    const savedSpeed = parseFloat(localStorage.getItem('algoviz_speed')) || DEFAULTS.SPEED_MULTIPLIER;
    const savedSize = parseInt(localStorage.getItem('algoviz_size'), 10) || DEFAULTS.ARRAY_SIZE;

    const initialAlgoMeta = ALGORITHM_METADATA[savedAlgo] || ALGORITHM_METADATA[DEFAULTS.ALGORITHM];

    this.state = {
      theme: savedTheme,
      algorithmId: initialAlgoMeta.id,
      category: initialAlgoMeta.category,
      
      // Array data
      arraySize: savedSize,
      array: generateRandomArray(savedSize, DEFAULTS.MIN_VALUE, DEFAULTS.MAX_VALUE),
      
      // Searching & Sorting options
      searchTarget: 42,
      pivotStrategy: DEFAULTS.PIVOT_STRATEGY,

      // Graph data
      graph: getSampleGraph(),
      graphSource: 'A',
      graphTarget: 'F',

      // Execution & Animation Engine State
      steps: [],
      currentStepIndex: 0,
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      speedMultiplier: savedSpeed,
      elapsedTime: 0
    };
  }

  get() {
    return this.state;
  }

  set(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Persist critical preferences
    if (updates.theme !== undefined) {
      localStorage.setItem('algoviz_theme', updates.theme);
      document.documentElement.setAttribute('data-theme', updates.theme);
    }
    if (updates.algorithmId !== undefined) {
      localStorage.setItem('algoviz_algo', updates.algorithmId);
    }
    if (updates.speedMultiplier !== undefined) {
      localStorage.setItem('algoviz_speed', updates.speedMultiplier);
    }
    if (updates.arraySize !== undefined) {
      localStorage.setItem('algoviz_size', updates.arraySize);
    }

    this.notify(prevState, this.state);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    return () => {
      const arr = this.listeners.get(key) || [];
      this.listeners.set(key, arr.filter(cb => cb !== callback));
    };
  }

  notify(prevState, newState) {
    this.listeners.forEach((callbacks, key) => {
      if (key === '*' || prevState[key] !== newState[key]) {
        callbacks.forEach(cb => cb(newState, prevState));
      }
    });
  }
}

export const stateStore = new StateStore();
