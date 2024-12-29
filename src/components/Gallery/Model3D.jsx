import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const MODEL_PATH = '/models/durk-model.glb';

export default function Model3D() {
  const groupRef = useRef();
  const glowRef = useRef();
  const { scrollYProgress } = useScroll();
  
  // Load the GLTF model
  const { scene, nodes, materials } = useGLTF(MODEL_PATH);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate based on scroll position with smooth damping
      const targetRotation = scrollYProgress.get() * Math.PI * 4;
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;
      
      // Add gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }

    // Animate materials
    Object.values(materials).forEach(material => {
      if (material.emissive) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    });

    // Pulsating glow effect
    if (glowRef.current) {
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      glowRef.current.intensity = intensity;
    }
  });

  // Initial model setup
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.emissive = new THREE.Color(0x00ffff);
            child.material.emissiveIntensity = 0.5;
          }
        }
      });
    }
  }, [scene]);

  // Clean up GLTF resources
  useEffect(() => {
    return () => {
      Object.values(materials).forEach(material => material.dispose());
      Object.values(nodes).forEach(node => {
        if (node.geometry) node.geometry.dispose();
      });
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main model */}
      <primitive 
        object={scene} 
        scale={0.005}
        position={[0, 0, 0]}
      />
      
      {/* Holographic grid effect */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4, 30, 30]} />
        <meshStandardMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight
        ref={glowRef}
        color="#00ffff"
        intensity={0.8}
        distance={5}
        decay={2}
        position={[0, 1, 0]}
      />
    </group>
  );
}

// Pre-load the model
useGLTF.preload(MODEL_PATH);
