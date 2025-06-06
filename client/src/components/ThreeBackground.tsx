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

    // Create floating crowns/flowers
    const crownGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const crownCount = scene === "invitation" ? 3 : 6;
    const crowns: THREE.Mesh[] = [];

    for (let i = 0; i < crownCount; i++) {
      const crownMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xFFD700 : 0xF9A8D4,
        transparent: true,
        opacity: 0.4,
      });
      
      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      
      crowns.push(crown);
      threeScene.add(crown);
    }

    camera.position.z = 5;

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Rotate particle system
      particleSystem.rotation.y = time * 0.1;
      particleSystem.rotation.x = time * 0.05;

      // Animate floating crowns
      crowns.forEach((crown, index) => {
        crown.rotation.y = time + index * 0.5;
        crown.position.y += Math.sin(time * 2 + index) * 0.002;
        crown.position.x += Math.cos(time * 1.5 + index) * 0.001;
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
