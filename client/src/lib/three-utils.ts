import * as THREE from "three";

export interface ParticleSystemConfig {
  count: number;
  spread: number;
  colors: string[];
  size: number;
  opacity: number;
}

export interface FloatingObjectConfig {
  count: number;
  spread: number;
  size: number;
  colors: string[];
  opacity: number;
}

export class RoyalGardenScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points | null = null;
  private floatingObjects: THREE.Mesh[] = [];
  private animationId: number | null = null;
  private time: number = 0;

  constructor(container: HTMLElement) {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  createParticleSystem(config: ParticleSystemConfig): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
      // Random positions within spread
      positions[i * 3] = (Math.random() - 0.5) * config.spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * config.spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * config.spread;

      // Random colors from config
      const color = new THREE.Color(config.colors[Math.floor(Math.random() * config.colors.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: config.size,
      vertexColors: true,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createFloatingObjects(config: FloatingObjectConfig): void {
    // Create different geometries for variety
    const geometries = [
      new THREE.SphereGeometry(config.size, 8, 8),
      new THREE.ConeGeometry(config.size, config.size * 2, 6),
      new THREE.OctahedronGeometry(config.size),
    ];

    for (let i = 0; i < config.count; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: config.opacity,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * config.spread,
        (Math.random() - 0.5) * config.spread,
        (Math.random() - 0.5) * (config.spread * 0.5)
      );

      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      this.floatingObjects.push(mesh);
      this.scene.add(mesh);
    }
  }

  createRoyalGarden(): void {
    // Create particle system with royal colors
    this.createParticleSystem({
      count: 150,
      spread: 20,
      colors: ['#1E3A8A', '#FFD700', '#F9A8D4', '#93C5FD'],
      size: 0.05,
      opacity: 0.6,
    });

    // Create floating crown-like objects
    this.createFloatingObjects({
      count: 6,
      spread: 15,
      size: 0.1,
      colors: ['#FFD700', '#F9A8D4'],
      opacity: 0.4,
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffd700, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  createInvitationScene(): void {
    // Simpler scene for invitation page
    this.createParticleSystem({
      count: 50,
      spread: 15,
      colors: ['#1E3A8A', '#FFD700', '#F9A8D4'],
      size: 0.08,
      opacity: 0.5,
    });

    this.createFloatingObjects({
      count: 3,
      spread: 10,
      size: 0.12,
      colors: ['#FFD700', '#F9A8D4'],
      opacity: 0.5,
    });

    // Softer lighting for invitation
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    this.scene.add(ambientLight);
  }

  animate(): void {
    this.time += 0.01;

    // Animate particles
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.1;
      this.particles.rotation.x = this.time * 0.05;

      // Gentle floating motion for particles
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      const positionAttribute = this.particles.geometry.attributes.position;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(this.time * 2 + i * 0.1) * 0.001;
        positions[i] += Math.cos(this.time * 1.5 + i * 0.1) * 0.0005;
      }
      
      positionAttribute.needsUpdate = true;
    }

    // Animate floating objects
    this.floatingObjects.forEach((obj, index) => {
      obj.rotation.y = this.time + index * 0.5;
      obj.rotation.x = this.time * 0.5 + index * 0.3;
      obj.position.y += Math.sin(this.time * 2 + index) * 0.002;
      obj.position.x += Math.cos(this.time * 1.5 + index) * 0.001;
    });

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  startAnimation(): void {
    if (!this.animationId) {
      this.animate();
    }
  }

  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // Clean up Three.js resources
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}

// Utility functions for royal garden theme
export const ROYAL_COLORS = {
  royalBlue: '#1E3A8A',
  skyBlue: '#93C5FD',
  slateGray: '#6B7280',
  softLilac: '#F9A8D4',
  gold: '#FFD700',
};

export function createGradientTexture(color1: string, color2: string, width = 256, height = 256): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

export function createSparkleEffect(scene: THREE.Scene, position: THREE.Vector3): void {
  const sparkleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const sparkleMaterial = new THREE.MeshBasicMaterial({
    color: ROYAL_COLORS.gold,
    transparent: true,
    opacity: 0.8,
  });

  for (let i = 0; i < 5; i++) {
    const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
    sparkle.position.copy(position);
    sparkle.position.add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ));
    
    scene.add(sparkle);

    // Animate sparkle
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / 1000; // 1 second animation

      if (progress < 1) {
        sparkle.scale.setScalar(1 - progress);
        sparkle.material.opacity = 0.8 * (1 - progress);
        requestAnimationFrame(animate);
      } else {
        scene.remove(sparkle);
        sparkle.geometry.dispose();
        sparkle.material.dispose();
      }
    };
    
    animate();
  }
}
