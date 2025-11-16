/**
 * PortfolioObjects - Creates and manages all 3D objects in the portfolio
 * Following Three.js best practices for geometry and material management
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class PortfolioObjects {
    constructor(scene) {
        this.scene = scene;
        this.objects = {
            hero: [],
            about: [],
            projects: [],
            skills: [],
            contact: []
        };
        this.currentSection = 0;
    }

    async createAllSections() {
        this.createHeroSection();
        this.createAboutSection();
        this.createProjectsSection();
        this.createSkillsSection();
        this.createContactSection();
    }

    createHeroSection() {
        // Central rotating torus
        const torusGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(0, 0, 0);
        this.scene.add(torus);
        this.objects.hero.push(torus);

        // Orbiting spheres
        for (let i = 0; i < 8; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xff00ff : 0x00ff88,
                emissive: i % 2 === 0 ? 0xff00ff : 0x00ff88,
                emissiveIntensity: 0.5,
                metalness: 0.9,
                roughness: 0.1
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            const angle = (i / 8) * Math.PI * 2;
            const radius = 5;
            sphere.position.x = Math.cos(angle) * radius;
            sphere.position.z = Math.sin(angle) * radius;
            sphere.userData.angle = angle;
            sphere.userData.radius = radius;

            this.scene.add(sphere);
            this.objects.hero.push(sphere);
        }

        // Wireframe pyramid
        const pyramidGeometry = new THREE.ConeGeometry(2, 4, 4);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true
        });
        const pyramid = new THREE.Mesh(pyramidGeometry, wireframeMaterial);
        pyramid.position.set(0, 0, -5);
        this.scene.add(pyramid);
        this.objects.hero.push(pyramid);
    }

    createAboutSection() {
        // Floating cubes representing experience
        const cubePositions = [
            { x: -10, y: 2, z: -2 },
            { x: -8, y: 0, z: 0 },
            { x: -10, y: -2, z: -2 }
        ];

        cubePositions.forEach((pos, index) => {
            const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x00ffff,
                linewidth: 2
            });
            const cube = new THREE.LineSegments(edges, lineMaterial);

            // Also add solid cube with transparency
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3,
                metalness: 0.5,
                roughness: 0.5
            });
            const solidCube = new THREE.Mesh(geometry, material);

            cube.position.set(pos.x, pos.y, pos.z);
            solidCube.position.set(pos.x, pos.y, pos.z);

            cube.userData.floatOffset = index * 0.5;
            solidCube.userData.floatOffset = index * 0.5;

            this.scene.add(cube);
            this.scene.add(solidCube);
            this.objects.about.push(cube, solidCube);
        });

        // DNA-like helix
        const helixPoints = [];
        for (let i = 0; i < 100; i++) {
            const t = i / 100;
            const angle = t * Math.PI * 4;
            const x = -6 + Math.cos(angle) * 1;
            const y = (t - 0.5) * 6;
            const z = Math.sin(angle) * 1;
            helixPoints.push(new THREE.Vector3(x, y, z));
        }

        const helixGeometry = new THREE.BufferGeometry().setFromPoints(helixPoints);
        const helixMaterial = new THREE.LineBasicMaterial({
            color: 0xff00ff,
            linewidth: 2
        });
        const helix = new THREE.Line(helixGeometry, helixMaterial);
        this.scene.add(helix);
        this.objects.about.push(helix);
    }

    createProjectsSection() {
        // Project cards as 3D planes
        const cardPositions = [
            { x: 6, y: 2, z: -2 },
            { x: 8, y: 0, z: 0 },
            { x: 6, y: -2, z: -2 }
        ];

        cardPositions.forEach((pos, index) => {
            const geometry = new THREE.PlaneGeometry(2.5, 1.5);
            const material = new THREE.MeshStandardMaterial({
                color: index === 0 ? 0x00ffff : index === 1 ? 0xff00ff : 0x00ff88,
                emissive: index === 0 ? 0x00ffff : index === 1 ? 0xff00ff : 0x00ff88,
                emissiveIntensity: 0.2,
                side: THREE.DoubleSide,
                metalness: 0.3,
                roughness: 0.7
            });
            const card = new THREE.Mesh(geometry, material);
            card.position.set(pos.x, pos.y, pos.z);
            card.rotation.y = -Math.PI / 6;
            card.userData.hoverY = pos.y;

            // Add frame
            const frameGeometry = new THREE.EdgesGeometry(geometry);
            const frameMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 2
            });
            const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
            frame.position.copy(card.position);
            frame.rotation.copy(card.rotation);

            this.scene.add(card);
            this.scene.add(frame);
            this.objects.projects.push(card, frame);
        });

        // Connecting network lines
        const networkGeometry = new THREE.BufferGeometry();
        const networkPositions = [];

        for (let i = 0; i < cardPositions.length - 1; i++) {
            networkPositions.push(
                cardPositions[i].x, cardPositions[i].y, cardPositions[i].z,
                cardPositions[i + 1].x, cardPositions[i + 1].y, cardPositions[i + 1].z
            );
        }

        networkGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(networkPositions, 3)
        );
        const networkMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            opacity: 0.5,
            transparent: true
        });
        const network = new THREE.LineSegments(networkGeometry, networkMaterial);
        this.scene.add(network);
        this.objects.projects.push(network);
    }

    createSkillsSection() {
        // Skill orbs in orbital pattern
        const skillColors = [0x00ffff, 0xff00ff, 0x00ff88];
        const orbits = 3;

        for (let orbit = 0; orbit < orbits; orbit++) {
            const radius = 3 + orbit * 1.5;
            const count = 4 + orbit * 2;

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const geometry = new THREE.IcosahedronGeometry(0.3, 0);
                const material = new THREE.MeshStandardMaterial({
                    color: skillColors[orbit],
                    emissive: skillColors[orbit],
                    emissiveIntensity: 0.5,
                    metalness: 0.8,
                    roughness: 0.2
                });
                const orb = new THREE.Mesh(geometry, material);

                orb.position.x = Math.cos(angle) * radius;
                orb.position.y = 3 + Math.sin(angle) * 0.5;
                orb.position.z = Math.sin(angle) * radius;

                orb.userData.angle = angle;
                orb.userData.radius = radius;
                orb.userData.orbit = orbit;
                orb.userData.speed = 0.5 + orbit * 0.2;

                this.scene.add(orb);
                this.objects.skills.push(orb);
            }
        }

        // Central skill core
        const coreGeometry = new THREE.OctahedronGeometry(1.5, 2);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            wireframe: true
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = 3;
        this.scene.add(core);
        this.objects.skills.push(core);
    }

    createContactSection() {
        // Communication waves
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.TorusGeometry(1 + i * 0.8, 0.05, 16, 100);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.6 - i * 0.1
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.position.set(0, -3, 0);
            ring.rotation.x = Math.PI / 2;
            ring.userData.delay = i * 0.2;
            ring.userData.initialScale = 1;

            this.scene.add(ring);
            this.objects.contact.push(ring);
        }

        // Message icon (envelope shape)
        const envelopeGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
        const envelopeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });
        const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
        envelope.position.set(0, -3, 0);
        this.scene.add(envelope);
        this.objects.contact.push(envelope);
    }

    updateActiveSection(sectionIndex) {
        this.currentSection = sectionIndex;

        // Hide all objects
        Object.values(this.objects).flat().forEach(obj => {
            gsap.to(obj.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: 'power2.in'
            });
        });

        // Show current section objects
        const sectionNames = ['hero', 'about', 'projects', 'skills', 'contact'];
        const currentObjects = this.objects[sectionNames[sectionIndex]];

        currentObjects.forEach((obj, index) => {
            gsap.to(obj.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5,
                delay: index * 0.05,
                ease: 'back.out(1.7)'
            });
        });
    }

    update(elapsedTime, deltaTime) {
        // Hero section animations
        this.objects.hero.forEach((obj, index) => {
            if (index === 0) {
                // Rotate main torus
                obj.rotation.x = elapsedTime * 0.3;
                obj.rotation.y = elapsedTime * 0.5;
            } else if (index <= 8) {
                // Orbit spheres
                const angle = obj.userData.angle + elapsedTime * 0.5;
                obj.position.x = Math.cos(angle) * obj.userData.radius;
                obj.position.z = Math.sin(angle) * obj.userData.radius;
                obj.position.y = Math.sin(elapsedTime * 0.5 + index) * 0.5;
            } else {
                // Rotate pyramid
                obj.rotation.y = elapsedTime * 0.3;
            }
        });

        // About section animations
        this.objects.about.forEach(obj => {
            if (obj.userData.floatOffset !== undefined) {
                obj.position.y += Math.sin(elapsedTime * 2 + obj.userData.floatOffset) * 0.002;
                obj.rotation.x = elapsedTime * 0.5;
                obj.rotation.y = elapsedTime * 0.3;
            } else {
                obj.rotation.z = elapsedTime * 0.2;
            }
        });

        // Projects section animations
        this.objects.projects.forEach(obj => {
            if (obj.userData.hoverY !== undefined) {
                obj.position.y = obj.userData.hoverY + Math.sin(elapsedTime * 2) * 0.1;
            }
        });

        // Skills section animations
        this.objects.skills.forEach(obj => {
            if (obj.userData.orbit !== undefined) {
                const angle = obj.userData.angle + elapsedTime * obj.userData.speed;
                obj.position.x = Math.cos(angle) * obj.userData.radius;
                obj.position.z = Math.sin(angle) * obj.userData.radius;
                obj.rotation.y = elapsedTime * 2;
            } else {
                obj.rotation.x = elapsedTime * 0.5;
                obj.rotation.y = elapsedTime * 0.7;
            }
        });

        // Contact section animations
        this.objects.contact.forEach((obj, index) => {
            if (obj.userData.delay !== undefined) {
                const scale = 1 + Math.sin(elapsedTime * 2 - obj.userData.delay) * 0.2;
                obj.scale.set(scale, scale, scale);
            } else {
                obj.rotation.y = Math.sin(elapsedTime) * 0.2;
                obj.position.y = -3 + Math.sin(elapsedTime * 2) * 0.1;
            }
        });
    }

    dispose() {
        Object.values(this.objects).flat().forEach(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
    }
}
