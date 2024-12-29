import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function QuestionMarkModel({ scrollProgress }) {
  const meshRef = useRef();
  
  // Create a curved path for the question mark
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(0.5, 1, 0),
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(-0.5, 1, 0),
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0, 0.3, 0),
  ]);

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state, delta) => {
    // Auto-rotation
    meshRef.current.rotation.y = scrollProgress * Math.PI * 2;
    
    // Add slight floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <group ref={meshRef}>
      <line geometry={geometry}>
        <lineBasicMaterial attach="material" color="#00A6FB" linewidth={3} />
      </line>
      {/* Add dot for question mark */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#00A6FB" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
