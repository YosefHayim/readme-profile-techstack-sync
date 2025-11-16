/**
 * PerformanceMonitor - Monitors and displays performance metrics
 * Uses Stats.js for FPS, MS, and memory tracking
 */

export class PerformanceMonitor {
    constructor() {
        this.stats = null;
        this.enabled = true;

        // Try to use Stats.js if available via CDN, otherwise use simple monitor
        this.initStats();
    }

    initStats() {
        // Simple performance monitor without Stats.js dependency
        this.container = document.createElement('div');
        this.container.id = 'performance-monitor';
        this.container.style.cssText = `
            position: fixed;
            top: 80px;
            left: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ffff;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #00ffff;
            border-radius: 5px;
            z-index: 999;
            min-width: 120px;
        `;

        this.fpsElement = document.createElement('div');
        this.msElement = document.createElement('div');
        this.memoryElement = document.createElement('div');

        this.container.appendChild(this.fpsElement);
        this.container.appendChild(this.msElement);
        this.container.appendChild(this.memoryElement);

        document.body.appendChild(this.container);

        // Performance tracking
        this.frames = 0;
        this.prevTime = performance.now();
        this.fps = 0;
        this.ms = 0;
    }

    update() {
        if (!this.enabled) return;

        this.frames++;
        const currentTime = performance.now();
        const delta = currentTime - this.prevTime;

        // Update every second
        if (delta >= 1000) {
            this.fps = Math.round((this.frames * 1000) / delta);
            this.ms = Math.round(delta / this.frames);
            this.frames = 0;
            this.prevTime = currentTime;

            this.updateDisplay();
        }
    }

    updateDisplay() {
        // FPS
        const fpsColor = this.fps >= 60 ? '#00ff00' : this.fps >= 30 ? '#ffff00' : '#ff0000';
        this.fpsElement.innerHTML = `<span style="color: ${fpsColor}">FPS: ${this.fps}</span>`;

        // MS
        this.msElement.innerHTML = `MS: ${this.ms}`;

        // Memory (if available)
        if (performance.memory) {
            const memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            this.memoryElement.innerHTML = `MEM: ${memory} MB`;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        this.container.style.display = this.enabled ? 'block' : 'none';
    }

    dispose() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
