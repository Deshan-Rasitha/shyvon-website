"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Golden Particles System
    const particleCount = prefersReducedMotion ? 40 : 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle Texture creation
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(246, 217, 137, 1)");
      gradient.addColorStop(0.3, "rgba(217, 173, 69, 0.7)");
      gradient.addColorStop(1, "rgba(217, 173, 69, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.9,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Floating Botanical Petals / Leaves (Curved meshes)
    const petalsGroup = new THREE.Group();
    const petalCount = prefersReducedMotion ? 6 : 18;

    // Create a curved petal geometry using a shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.8, 1.5, 0, 3);
    petalShape.quadraticCurveTo(-0.8, 1.5, 0, 0);

    const petalGeom = new THREE.ShapeGeometry(petalShape);

    // Materials: Gold accents and Blue Lotus hues
    const goldPetalMat = new THREE.MeshBasicMaterial({
      color: 0xD9AD45,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });

    const lotusPetalMat = new THREE.MeshBasicMaterial({
      color: 0x4A6FA5,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const petals: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      driftSpeedY: number;
      initialX: number;
      initialY: number;
    }[] = [];

    for (let i = 0; i < petalCount; i++) {
      const mat = i % 2 === 0 ? goldPetalMat : lotusPetalMat;
      const mesh = new THREE.Mesh(petalGeom, mat);
      const scale = 0.35 + Math.random() * 0.45;
      mesh.scale.set(scale, scale, scale);

      mesh.position.x = (Math.random() - 0.5) * 40;
      mesh.position.y = (Math.random() - 0.5) * 26;
      mesh.position.z = (Math.random() - 0.5) * 15;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      petalsGroup.add(mesh);
      petals.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        driftSpeedY: 0.008 + Math.random() * 0.012,
        initialX: mesh.position.x,
        initialY: mesh.position.y,
      });
    }

    scene.add(petalsGroup);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera parallax
      targetX += (mouseX * 1.5 - targetX) * 0.05;
      targetY += (-mouseY * 1.5 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      // Rotate particle cloud gently
      if (!prefersReducedMotion) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Animate floating petals
        petals.forEach((p) => {
          p.mesh.rotation.x += p.rotSpeedX;
          p.mesh.rotation.y += p.rotSpeedY;
          p.mesh.rotation.z += p.rotSpeedZ;

          p.mesh.position.y -= p.driftSpeedY;
          if (p.mesh.position.y < -15) {
            p.mesh.position.y = 15;
            p.mesh.position.x = (Math.random() - 0.5) * 40;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      petalGeom.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
}
