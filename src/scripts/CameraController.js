/**
 * CameraController - Manages camera movements and animations
 * Implements smooth transitions between sections
 */

import gsap from 'gsap';
import * as THREE from 'three';

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.targetPosition = new THREE.Vector3(0, 0, 15);
        this.targetRotation = new THREE.Euler(0, 0, 0);
        this.mousePosX = 0;
        this.mousePosY = 0;
        this.parallaxStrength = 0.01;

        // Camera positions for each section
        this.sectionPositions = [
            { x: 0, y: 0, z: 15, lookAt: { x: 0, y: 0, z: 0 } },      // Home
            { x: -8, y: 2, z: 12, lookAt: { x: -8, y: 0, z: 0 } },     // About
            { x: 8, y: -2, z: 12, lookAt: { x: 8, y: 0, z: 0 } },      // Projects
            { x: 0, y: 5, z: 10, lookAt: { x: 0, y: 3, z: 0 } },       // Skills
            { x: 0, y: -3, z: 13, lookAt: { x: 0, y: -3, z: 0 } }      // Contact
        ];
    }

    moveToSection(sectionIndex) {
        const position = this.sectionPositions[sectionIndex];
        if (!position) return;

        // Animate camera position
        gsap.to(this.camera.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1.5,
            ease: 'power2.inOut'
        });

        // Animate camera lookAt
        const lookAtVector = new THREE.Vector3(
            position.lookAt.x,
            position.lookAt.y,
            position.lookAt.z
        );

        gsap.to(this.targetPosition, {
            x: lookAtVector.x,
            y: lookAtVector.y,
            z: lookAtVector.z,
            duration: 1.5,
            ease: 'power2.inOut'
        });
    }

    handleMouseMove(event) {
        // Normalize mouse position to -1 to 1
        this.mousePosX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    update(deltaTime) {
        // Apply parallax effect based on mouse position
        const targetX = this.camera.position.x + this.mousePosX * this.parallaxStrength;
        const targetY = this.camera.position.y + this.mousePosY * this.parallaxStrength;

        // Smooth lerp to target
        this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.05;

        // Always look at target position
        this.camera.lookAt(this.targetPosition);
    }

    shake(intensity = 0.5, duration = 0.3) {
        const originalPosition = this.camera.position.clone();

        gsap.to(this.camera.position, {
            x: `+=${Math.random() * intensity - intensity / 2}`,
            y: `+=${Math.random() * intensity - intensity / 2}`,
            z: `+=${Math.random() * intensity - intensity / 2}`,
            duration: duration / 2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }
}
