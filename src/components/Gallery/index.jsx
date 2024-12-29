import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import styled from 'styled-components';
import Model3D from './Model3D';

const GallerySection = styled.section`
  height: 100vh;
  position: relative;
  margin: var(--section-spacing) 0;
`;

const ModelWindow = styled.div`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  position: relative;
  background: rgba(0, 166, 251, 0.05);
  border: 1px solid var(--light-blue);
  border-radius: 8px;
  overflow: hidden;
`;

export default function Gallery() {
  return (
    <GallerySection id="gallery">
      <ModelWindow>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model3D />
          <OrbitControls enableZoom={false} />
          <Environment preset="city" />
        </Canvas>
      </ModelWindow>
    </GallerySection>
  );
}
