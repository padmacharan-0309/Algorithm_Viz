/* ==========================================================================
   ALGO VIZ - UI Controller & Event Handlers
   Manages controls, modals, sidebar selection, and DOM sync
   ========================================================================== */

import { stateStore } from './state.js';
import { ALGORITHM_METADATA, SPEED_PRESETS, CATEGORIES } from './utils/constants.js';
import { $, $$, showToast, sound } from './utils/helpers.js';
import {
  generateRandomArray,
  generateNearlySortedArray,
  generateReversedArray,
  generateFewUniqueArray,
  getSampleGraph
} from './utils/random.js';
import { visualizer } from './visualizer.js';

export class UIController {
  constructor() {
    this.boundKeydown = this.handleKeydown.bind(this);
  }

  init() {
    this.renderAlgorithmInfo();
    this.bindSidebarEvents();
    this.bindPlaybackControls();
    this.bindConfigurationControls();
    this.bindModals();
    this.bindKeyboardShortcuts();
    this.bindThemeAndSound();
    this.bindMobileNav();

    // Subscribe to state updates
    stateStore.subscribe('algorithmId', () => {
      this.renderAlgorithmInfo();
      visualizer.recomputeSteps();
      visualizer.renderCurrentStep();
    });

    stateStore.subscribe('isPlaying', (state) => {
      this.updatePlayPauseButtons(state.isPlaying);
    });

    stateStore.subscribe('speedMultiplier', (state) => {
      this.updateSpeedUI(state.speedMultiplier);
    });

    stateStore.subscribe('arraySize', (state) => {
      const sizeVal = $('#size-val');
      if (sizeVal) sizeVal.textContent = state.arraySize;
    });
  }

  /**
   * Render Algorithm header, metadata, complexity table, and pseudocode
   */
  renderAlgorithmInfo() {
    const s = stateStore.get();
    const meta = ALGORITHM_METADATA[s.algorithmId] || ALGORITHM_METADATA['bubble-sort'];

    // Header info
    const titleEl = $('#algo-title');
    const badgeCategory = $('#algo-category-badge');
    if (titleEl) titleEl.textContent = meta.name;
    if (badgeCategory) badgeCategory.textContent = meta.category.toUpperCase();

    // Tags
    const inPlaceBadge = $('#badge-inplace');
    const stableBadge = $('#badge-stable');
    if (inPlaceBadge) inPlaceBadge.textContent = meta.inPlace ? 'In-Place' : 'Out-of-Place';
    if (stableBadge) stableBadge.textContent = meta.stable ? 'Stable' : 'Unstable';

    // Description & How it works
    const descEl = $('#algo-description');
    if (descEl) {
      descEl.innerHTML = `
        <p>${meta.description}</p>
        <p style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.8rem;">
          <strong style="color: var(--text-secondary);">How it works:</strong> ${meta.howItWorks}
        </p>
      `;
    }

    // Complexity table
    const timeBest = $('#comp-time-best');
    const timeAvg = $('#comp-time-avg');
    const timeWorst = $('#comp-time-worst');
    const spaceComp = $('#comp-space');

    if (timeBest) timeBest.textContent = meta.timeComplexity.best;
    if (timeAvg) timeAvg.textContent = meta.timeComplexity.average;
    if (timeWorst) timeWorst.textContent = meta.timeComplexity.worst;
    if (spaceComp) spaceComp.textContent = meta.spaceComplexity;

    // Pseudocode
    const codeContainer = $('#pseudocode-container');
    if (codeContainer) {
      codeContainer.innerHTML = meta.pseudocode.map((line, idx) => `
        <div class="code-line" data-line="${idx}">
          <span class="code-line-number">${idx + 1}</span>
          <span class="code-line-text">${escapeHtml(line)}</span>
        </div>
      `).join('');
    }

    // Dynamic Control Visibility
    const pivotControl = $('#pivot-strategy-control');
    const searchTargetControl = $('#search-target-control');
    const graphControls = $('#graph-controls-cluster');
    const arrayControls = $('#array-controls-cluster');

    if (meta.hasPivotStrategy) {
      if (pivotControl) pivotControl.style.display = 'flex';
    } else {
      if (pivotControl) pivotControl.style.display = 'none';
    }

    if (meta.needsTarget) {
      if (searchTargetControl) searchTargetControl.style.display = 'flex';
    } else {
      if (searchTargetControl) searchTargetControl.style.display = 'none';
    }

    if (meta.isGraph) {
      if (graphControls) graphControls.style.display = 'flex';
      if (arrayControls) arrayControls.style.display = 'none';
    } else {
      if (graphControls) graphControls.style.display = 'none';
      if (arrayControls) arrayControls.style.display = 'flex';
    }

    // Highlight active sidebar item
    $$('.algo-item-btn').forEach(btn => {
      if (btn.getAttribute('data-algo') === s.algorithmId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Bind sidebar algorithm selection buttons
   */
  bindSidebarEvents() {
    $$('.algo-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const algoId = btn.getAttribute('data-algo');
        const meta = ALGORITHM_METADATA[algoId];
        if (meta) {
          stateStore.set({
            algorithmId: algoId,
            category: meta.category
          });
          // Close mobile sidebar if open
          this.closeMobileSidebar();
        }
      });
    });
  }

  /**
   * Bind Play, Pause, Step Forward, Step Back, Reset
   */
  bindPlaybackControls() {
    const playBtn = $('#btn-play');
    const pauseBtn = $('#btn-pause');
    const resetBtn = $('#btn-reset');
    const nextBtn = $('#btn-step-next');
    const prevBtn = $('#btn-step-prev');
    const timeline = $('#timeline-slider');

    if (playBtn) {
      playBtn.addEventListener('click', () => visualizer.play());
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => visualizer.pause());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => visualizer.reset());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => visualizer.stepForward());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => visualizer.stepBackward());
    }

    if (timeline) {
      timeline.addEventListener('input', (e) => {
        visualizer.jumpToStep(parseInt(e.target.value, 10));
      });
    }
  }

  /**
   * Bind parameter sliders, chips, and input handlers
   */
  bindConfigurationControls() {
    // Array Size Slider
    const sizeSlider = $('#size-slider');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        const newSize = parseInt(e.target.value, 10);
        stateStore.set({
          arraySize: newSize,
          array: generateRandomArray(newSize, 5, 100)
        });
        visualizer.recomputeSteps();
        visualizer.renderCurrentStep();
      });
    }

    // Generate Array Button
    const generateArrayBtn = $('#btn-generate-array');
    if (generateArrayBtn) {
      generateArrayBtn.addEventListener('click', () => {
        const s = stateStore.get();
        stateStore.set({
          array: generateRandomArray(s.arraySize, 5, 100)
        });
        visualizer.recomputeSteps();
        visualizer.renderCurrentStep();
        showToast('Generated new random array', 'info');
      });
    }

    // Quick Sort Pivot Strategy Select
    const pivotSelect = $('#pivot-strategy-select');
    if (pivotSelect) {
      pivotSelect.addEventListener('change', (e) => {
        stateStore.set({ pivotStrategy: e.target.value });
        visualizer.recomputeSteps();
        visualizer.renderCurrentStep();
      });
    }

    // Search Target Input
    const searchInput = $('#search-target-input');
    if (searchInput) {
      searchInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          stateStore.set({ searchTarget: val });
          visualizer.recomputeSteps();
          visualizer.renderCurrentStep();
        }
      });
    }

    // Speed Preset Chips
    $$('.speed-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const factor = parseFloat(chip.getAttribute('data-speed'));
        stateStore.set({ speedMultiplier: factor });
      });
    });

    // Speed Slider
    const speedSlider = $('#speed-slider');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        const factor = parseFloat(e.target.value);
        stateStore.set({ speedMultiplier: factor });
      });
    }

    // Graph Reset / Sample Button
    const sampleGraphBtn = $('#btn-sample-graph');
    if (sampleGraphBtn) {
      sampleGraphBtn.addEventListener('click', () => {
        stateStore.set({ graph: getSampleGraph() });
        visualizer.recomputeSteps();
        visualizer.renderCurrentStep();
        showToast('Sample graph restored', 'info');
      });
    }
  }

  updatePlayPauseButtons(isPlaying) {
    const playBtn = $('#btn-play');
    const pauseBtn = $('#btn-pause');
    if (playBtn && pauseBtn) {
      if (isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
      } else {
        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
      }
    }
  }

  updateSpeedUI(multiplier) {
    $$('.speed-chip').forEach(chip => {
      const spd = parseFloat(chip.getAttribute('data-speed'));
      if (spd === multiplier) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    const speedSlider = $('#speed-slider');
    const speedVal = $('#speed-val');
    if (speedSlider) speedSlider.value = multiplier;
    if (speedVal) speedVal.textContent = `${multiplier}x`;
  }

  /**
   * Bind Modals (Manual Input, Keyboard Shortcuts, About)
   */
  bindModals() {
    // Manual Input Modal
    const manualBtn = $('#btn-manual-input');
    const manualModal = $('#modal-manual-input');
    const manualClose = $('#btn-close-manual');
    const manualApply = $('#btn-apply-manual');
    const manualInputText = $('#manual-array-input');

    if (manualBtn && manualModal) {
      manualBtn.addEventListener('click', () => {
        const s = stateStore.get();
        if (manualInputText) manualInputText.value = s.array.join(', ');
        manualModal.classList.add('open');
      });
    }

    if (manualClose && manualModal) {
      manualClose.addEventListener('click', () => manualModal.classList.remove('open'));
    }

    if (manualApply && manualInputText) {
      manualApply.addEventListener('click', () => {
        const raw = manualInputText.value.trim();
        const parts = raw.split(/[\s,]+/).filter(Boolean);
        const parsed = parts.map(p => Number(p));

        if (parsed.length < 2) {
          showToast('Please enter at least 2 numbers.', 'error');
          return;
        }

        if (parsed.length > 100) {
          showToast('Please enter at most 100 numbers for optimal visualization.', 'error');
          return;
        }

        if (parsed.some(isNaN)) {
          showToast('Invalid input! Please enter only valid integers.', 'error');
          return;
        }

        stateStore.set({
          arraySize: parsed.length,
          array: parsed
        });

        visualizer.recomputeSteps();
        visualizer.renderCurrentStep();
        manualModal.classList.remove('open');
        showToast(`Loaded array with ${parsed.length} elements`, 'success');
      });
    }

    // Array Generation Presets inside Modal
    $$('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const preset = chip.getAttribute('data-preset');
        const s = stateStore.get();
        let newArr = [];
        if (preset === 'reversed') newArr = generateReversedArray(s.arraySize);
        else if (preset === 'nearly-sorted') newArr = generateNearlySortedArray(s.arraySize);
        else if (preset === 'few-unique') newArr = generateFewUniqueArray(s.arraySize);
        else newArr = generateRandomArray(s.arraySize, 5, 100);

        if (manualInputText) manualInputText.value = newArr.join(', ');
      });
    });

    // Keyboard Shortcuts Dialog
    const shortcutsBtn = $('#btn-shortcuts');
    const shortcutsModal = $('#modal-shortcuts');
    const shortcutsClose = $('#btn-close-shortcuts');

    if (shortcutsBtn && shortcutsModal) {
      shortcutsBtn.addEventListener('click', () => shortcutsModal.classList.add('open'));
    }
    if (shortcutsClose && shortcutsModal) {
      shortcutsClose.addEventListener('click', () => shortcutsModal.classList.remove('open'));
    }

    // About Dialog
    const aboutBtn = $('#btn-about');
    const aboutModal = $('#modal-about');
    const aboutClose = $('#btn-close-about');

    if (aboutBtn && aboutModal) {
      aboutBtn.addEventListener('click', () => aboutModal.classList.add('open'));
    }
    if (aboutClose && aboutModal) {
      aboutClose.addEventListener('click', () => aboutModal.classList.remove('open'));
    }

    // Close modals on clicking backdrop
    $$('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    });
  }

  /**
   * Bind Keyboard Navigation (Space = Play/Pause, R = Reset, Arrows = Steps, ? = Help)
   */
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', this.boundKeydown);
  }

  handleKeydown(e) {
    // If typing in input box, don't trigger shortcuts
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      const s = stateStore.get();
      if (s.isPlaying) visualizer.pause();
      else visualizer.play();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      visualizer.reset();
      showToast('Visualization reset', 'info');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      visualizer.stepForward();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      visualizer.stepBackward();
    } else if (e.key === '?') {
      e.preventDefault();
      const shortcutsModal = $('#modal-shortcuts');
      if (shortcutsModal) shortcutsModal.classList.toggle('open');
    } else if (e.key === 'Escape') {
      $$('.modal-backdrop').forEach(m => m.classList.remove('open'));
      this.closeMobileSidebar();
    }
  }

  /**
   * Bind Theme Switcher & Sound FX Toggle
   */
  bindThemeAndSound() {
    const themeBtn = $('#btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curTheme = stateStore.get().theme;
        const newTheme = curTheme === 'dark' ? 'light' : 'dark';
        stateStore.set({ theme: newTheme });
        themeBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        showToast(`Theme switched to ${newTheme} mode`, 'info');
      });
    }

    const soundBtn = $('#btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundBtn.innerHTML = sound.enabled ? '🔊' : '🔇';
        soundBtn.classList.toggle('active', sound.enabled);
        showToast(`Audio cues ${sound.enabled ? 'enabled' : 'disabled'}`, 'info');
      });
    }
  }

  /**
   * Mobile Sidebar drawer toggling
   */
  bindMobileNav() {
    const toggleBtn = $('#btn-sidebar-toggle');
    const sidebar = $('#app-sidebar');
    const overlay = $('#sidebar-overlay');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
      });

      overlay.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }
  }

  closeMobileSidebar() {
    const sidebar = $('#app-sidebar');
    const overlay = $('#sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export const ui = new UIController();
