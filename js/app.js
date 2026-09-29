/* ==========================================================================
   ALGO VIZ - Main Application Entrypoint
   ========================================================================== */

import { stateStore } from './state.js';
import { ui } from './ui.js';
import { visualizer } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  const currentTheme = stateStore.get().theme;
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Initialize UI and Visualizer
  ui.init();
  visualizer.init();

  console.log('⚡ AlgoViz initialized successfully!');
});
