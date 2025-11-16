/**
 * InteractionManager - Handles user interactions with 3D objects
 * Implements raycasting for object picking
 */

import * as THREE from 'three';

export class InteractionManager {
    constructor(camera, renderer, portfolioObjects) {
        this.camera = camera;
        this.renderer = renderer;
        this.portfolioObjects = portfolioObjects;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredObject = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('click', this.onClick.bind(this), false);
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onTouchStart(event) {
        if (event.touches.length > 0) {
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            this.checkIntersections();
        }
    }

    onClick(event) {
        this.checkIntersections(true);
    }

    checkIntersections(isClick = false) {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Get all objects from current section
        const sectionNames = ['hero', 'about', 'projects', 'skills', 'contact'];
        const currentSection = this.portfolioObjects.currentSection;
        const currentObjects = this.portfolioObjects.objects[sectionNames[currentSection]];

        // Calculate intersections
        const intersects = this.raycaster.intersectObjects(currentObjects, false);

        if (intersects.length > 0) {
            const object = intersects[0].object;

            if (isClick) {
                this.handleObjectClick(object);
            } else {
                this.handleObjectHover(object);
            }
        } else {
            this.clearHover();
        }
    }

    handleObjectHover(object) {
        if (this.hoveredObject !== object) {
            this.clearHover();
            this.hoveredObject = object;

            // Change cursor
            document.body.style.cursor = 'pointer';

            // Highlight object (if it has material)
            if (object.material) {
                object.userData.originalEmissiveIntensity = object.material.emissiveIntensity || 0;
                if (object.material.emissiveIntensity !== undefined) {
                    object.material.emissiveIntensity = 1;
                }
            }
        }
    }

    handleObjectClick(object) {
        console.log('Clicked object:', object);

        // Create ripple effect at click position
        this.createRipple(object.position);

        // Add click animation
        const originalScale = { x: object.scale.x, y: object.scale.y, z: object.scale.z };

        // Simple scale animation
        const scaleUp = () => {
            object.scale.multiplyScalar(1.2);
            setTimeout(() => {
                object.scale.set(originalScale.x, originalScale.y, originalScale.z);
            }, 150);
        };

        scaleUp();
    }

    createRipple(position) {
        const rippleGeometry = new THREE.RingGeometry(0.1, 0.5, 32);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.copy(position);

        this.portfolioObjects.scene.add(ripple);

        // Animate ripple
        const startTime = Date.now();
        const duration = 1000;

        const animateRipple = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                ripple.scale.set(1 + progress * 3, 1 + progress * 3, 1);
                ripple.material.opacity = 1 - progress;
                requestAnimationFrame(animateRipple);
            } else {
                this.portfolioObjects.scene.remove(ripple);
                ripple.geometry.dispose();
                ripple.material.dispose();
            }
        };

        animateRipple();
    }

    clearHover() {
        if (this.hoveredObject) {
            document.body.style.cursor = 'default';

            // Restore original emissive intensity
            if (this.hoveredObject.material && this.hoveredObject.userData.originalEmissiveIntensity !== undefined) {
                this.hoveredObject.material.emissiveIntensity = this.hoveredObject.userData.originalEmissiveIntensity;
            }

            this.hoveredObject = null;
        }
    }

    update() {
        this.checkIntersections(false);
    }

    dispose() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onClick.bind(this));
        window.removeEventListener('touchstart', this.onTouchStart.bind(this));
    }
}
