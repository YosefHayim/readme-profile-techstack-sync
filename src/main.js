/**
 * Main entry point for 3D Portfolio
 * Following Three.js best practices for performance and organization
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { SceneManager } from './scripts/SceneManager.js';
import { CameraController } from './scripts/CameraController.js';
import { PortfolioObjects } from './scripts/PortfolioObjects.js';
import { InteractionManager } from './scripts/InteractionManager.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';

class Portfolio3D {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;

        // Managers
        this.sceneManager = null;
        this.cameraController = null;
        this.portfolioObjects = null;
        this.interactionManager = null;
        this.performanceMonitor = null;

        // State
        this.isInitialized = false;
        this.currentSection = 0;
        this.clock = new THREE.Clock();

        // Bind methods
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.init();
    }

    async init() {
        try {
            // Initialize scene
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            this.setupPostProcessing();

            // Initialize managers
            this.sceneManager = new SceneManager(this.scene);
            this.cameraController = new CameraController(this.camera);
            this.portfolioObjects = new PortfolioObjects(this.scene);
            this.interactionManager = new InteractionManager(
                this.camera,
                this.renderer,
                this.portfolioObjects
            );

            // Performance monitoring (dev only)
            if (import.meta.env.DEV) {
                this.performanceMonitor = new PerformanceMonitor();
            }

            // Create 3D objects
            await this.portfolioObjects.createAllSections();

            // Setup event listeners
            this.setupEventListeners();

            // Start animation loop
            this.animate();

            // Hide loading screen
            this.hideLoadingScreen();

            this.isInitialized = true;
            console.log('Portfolio 3D initialized successfully');
        } catch (error) {
            console.error('Error initializing Portfolio 3D:', error);
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);
    }

    setupCamera() {
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 15);
    }

    setupRenderer() {
        const container = document.getElementById('canvas-container');

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7.5);
        mainLight.castShadow = true;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Accent lights for atmosphere
        const accentLight1 = new THREE.PointLight(0x00ffff, 1, 50);
        accentLight1.position.set(-10, 5, -10);
        this.scene.add(accentLight1);

        const accentLight2 = new THREE.PointLight(0xff00ff, 1, 50);
        accentLight2.position.set(10, 5, -10);
        this.scene.add(accentLight2);

        // Rim light for depth
        const rimLight = new THREE.DirectionalLight(0x00ff88, 0.5);
        rimLight.position.set(-5, 0, -10);
        this.scene.add(rimLight);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom pass for glow effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize, false);

        // Navigation clicks
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionIndex = parseInt(link.dataset.section);
                this.navigateToSection(sectionIndex);
            });
        });

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.navigateToSection(1);
            });
        }

        // Mouse move for parallax effect
        document.addEventListener('mousemove', (e) => {
            if (this.cameraController) {
                this.cameraController.handleMouseMove(e);
            }
        });

        // Scroll handling
        let scrollTimeout;
        window.addEventListener('wheel', (e) => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (e.deltaY > 0 && this.currentSection < 4) {
                    this.navigateToSection(this.currentSection + 1);
                } else if (e.deltaY < 0 && this.currentSection > 0) {
                    this.navigateToSection(this.currentSection - 1);
                }
            }, 100);
        }, { passive: true });
    }

    navigateToSection(sectionIndex) {
        if (sectionIndex === this.currentSection) return;

        this.currentSection = sectionIndex;

        // Update content sections visibility
        const sections = document.querySelectorAll('.content-section');
        sections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Move camera to section
        this.cameraController.moveToSection(sectionIndex);

        // Update 3D objects
        this.portfolioObjects.updateActiveSection(sectionIndex);
    }

    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        // Update pixel ratio (clamped for performance)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update managers
        if (this.portfolioObjects) {
            this.portfolioObjects.update(elapsedTime, deltaTime);
        }

        if (this.cameraController) {
            this.cameraController.update(deltaTime);
        }

        if (this.interactionManager) {
            this.interactionManager.update();
        }

        // Render
        this.composer.render();

        // Performance monitoring
        if (this.performanceMonitor) {
            this.performanceMonitor.update();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            onComplete: () => {
                loadingScreen.classList.add('fade-out');
            }
        });
    }

    // Cleanup method for proper disposal
    dispose() {
        window.removeEventListener('resize', this.onWindowResize);

        // Dispose Three.js resources
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        this.renderer.dispose();
        this.composer.dispose();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Portfolio3D();
    });
} else {
    new Portfolio3D();
}
