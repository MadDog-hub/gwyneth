import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  scene: "invitation" | "main";
}

export default function ThreeBackground({ scene }: ThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const plantsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const threeScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = threeScene;
    rendererRef.current = renderer;

    // Create floating particles
    const particleCount = scene === "invitation" ? 50 : 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color variations for royal theme
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Royal blue (#1E3A8A)
        colors[i * 3] = 0.12; // R
        colors[i * 3 + 1] = 0.23; // G
        colors[i * 3 + 2] = 0.54; // B
      } else if (colorChoice < 0.66) {
        // Gold (#FFD700)
        colors[i * 3] = 1.0; // R
        colors[i * 3 + 1] = 0.84; // G
        colors[i * 3 + 2] = 0.0; // B
      } else {
        // Soft lilac (#F9A8D4)
        colors[i * 3] = 0.98; // R
        colors[i * 3 + 1] = 0.66; // G
        colors[i * 3 + 2] = 0.83; // B
      }
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: scene === "invitation" ? 0.1 : 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    threeScene.add(particleSystem);

    // Create large 3D plants and flowers
    const plantCount = scene === "invitation" ? 5 : 12;
    const plants: THREE.Group[] = [];

    for (let i = 0; i < plantCount; i++) {
      const plantGroup = new THREE.Group();
      
      // Create flower petals (using multiple spheres)
      const petalGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const petalColors = [0x22C55E, 0x10B981, 0xF9A8D4, 0xFFD700];
      const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
      
      const petalMaterial = new THREE.MeshBasicMaterial({
        color: petalColor,
        transparent: true,
        opacity: 0.7,
      });

      // Create flower petals in a circle
      for (let j = 0; j < 6; j++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (j / 6) * Math.PI * 2;
        petal.position.set(
          Math.cos(angle) * 0.5,
          Math.sin(angle) * 0.5,
          0
        );
        petal.scale.set(0.6, 1.2, 0.3);
        plantGroup.add(petal);
      }

      // Create flower center
      const centerGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.8,
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      plantGroup.add(center);

      // Create stem
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 2, 8);
      const stemMaterial = new THREE.MeshBasicMaterial({
        color: 0x22C55E,
        transparent: true,
        opacity: 0.6,
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -1;
      plantGroup.add(stem);

      // Create leaves
      const leafGeometry = new THREE.SphereGeometry(0.4, 8, 8);
      const leafMaterial = new THREE.MeshBasicMaterial({
        color: 0x10B981,
        transparent: true,
        opacity: 0.7,
      });
      
      for (let k = 0; k < 3; k++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
          (Math.random() - 0.5) * 0.8,
          -0.5 - Math.random() * 0.5,
          (Math.random() - 0.5) * 0.8
        );
        leaf.scale.set(0.8, 0.3, 1.5);
        leaf.rotation.z = Math.random() * Math.PI * 2;
        plantGroup.add(leaf);
      }

      // Position the entire plant
      plantGroup.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 12
      );
      
      plantGroup.scale.setScalar(scene === "invitation" ? 0.8 : 1.2);
      
      plants.push(plantGroup);
      threeScene.add(plantGroup);
    }

    // Store plants reference for animation
    plantsRef.current = plants;

    camera.position.z = 5;

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Rotate particle system
      particleSystem.rotation.y = time * 0.1;
      particleSystem.rotation.x = time * 0.05;

      // Animate floating plants and flowers
      plantsRef.current.forEach((plant, index) => {
        plant.rotation.y = time * 0.3 + index * 0.2;
        plant.position.y += Math.sin(time * 1.5 + index) * 0.003;
        plant.position.x += Math.cos(time * 1.2 + index) * 0.002;
        
        // Animate individual components
        plant.children.forEach((child, childIndex) => {
          if (childIndex < 6) { // Petals
            child.rotation.z = time * 0.5 + childIndex * 0.3;
            child.scale.setScalar(0.8 + Math.sin(time * 2 + childIndex) * 0.1);
          }
        });
      });

      // Gentle particle movement
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.001;
        positions[i * 3] += Math.cos(time + i * 0.1) * 0.0005;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(threeScene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scene]);

  return <div ref={mountRef} className="three-bg" />;
}
