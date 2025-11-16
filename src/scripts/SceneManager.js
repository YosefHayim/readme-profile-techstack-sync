/**
 * SceneManager - Manages the overall scene setup and environment
 * Following Three.js best practices for scene organization
 */

import * as THREE from 'three';

export class SceneManager {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = null;
        this.stars = null;

        this.createEnvironment();
    }

    createEnvironment() {
        this.createStarfield();
        this.createParticles();
        this.createGridHelper();
    }

    createStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );

        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCnt = 5000;

        const posArray = new Float32Array(particlesCnt * 3);
        const colorArray = new Float32Array(particlesCnt * 3);

        for (let i = 0; i < particlesCnt * 3; i += 3) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 100;
            posArray[i + 1] = (Math.random() - 0.5) * 100;
            posArray[i + 2] = (Math.random() - 0.5) * 100;

            // Color - mix of cyan, magenta, and green
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colorArray[i] = 0;
                colorArray[i + 1] = 1;
                colorArray[i + 2] = 1;
            } else if (colorChoice < 0.66) {
                colorArray[i] = 1;
                colorArray[i + 1] = 0;
                colorArray[i + 2] = 1;
            } else {
                colorArray[i] = 0;
                colorArray[i + 1] = 1;
                colorArray[i + 2] = 0.5;
            }
        }

        particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(posArray, 3)
        );
        particlesGeometry.setAttribute(
            'color',
            new THREE.BufferAttribute(colorArray, 3)
        );

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particleSystem);
    }

    createGridHelper() {
        const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x444444);
        gridHelper.position.y = -5;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    update(elapsedTime) {
        // Rotate stars slowly
        if (this.stars) {
            this.stars.rotation.y = elapsedTime * 0.02;
        }

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y = elapsedTime * 0.05;
            this.particleSystem.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
        }
    }

    dispose() {
        // Clean up geometries and materials
        if (this.stars) {
            this.stars.geometry.dispose();
            this.stars.material.dispose();
        }
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
    }
}
