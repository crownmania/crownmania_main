import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CollectibleModel from './3d/CollectibleModel';
import QuestionMarkModel from './3d/QuestionMarkModel';

const ShopSection = styled.section`
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const WindowsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShopWindow = styled(motion.div)`
  aspect-ratio: 3/4;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at bottom right,
      rgba(0, 102, 255, 0.1),
      transparent 70%
    );
    pointer-events: none;
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--light-blue);
    box-shadow: 0 5px 30px rgba(0, 102, 255, 0.2);
  }
`;

const ModelWindow = styled(ShopWindow)`
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const ExpandedWindow = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProductInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  font-family: 'Designer', sans-serif;
  font-size: 1.2rem;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ExpandedTitle = styled(Title)`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const Price = styled.span`
  font-family: 'Designer', sans-serif;
  font-size: 1.6rem;
  color: var(--light-blue);
  margin-left: 1rem;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ComingSoonText = styled.div`
  font-family: 'Designer', sans-serif;
  font-size: 2rem;
  color: var(--light-blue);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.8;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ComingSoonWindow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Designer', sans-serif;
  position: relative;
  text-align: center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 102, 255, 0.1),
      transparent 70%
    );
    pointer-events: none;
    animation: pulse 4s ease-in-out infinite;
  }
`;

const BuyButton = styled(motion.button)`
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--light-blue);
  color: var(--light-blue);
  cursor: pointer;
  border-radius: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.1);

  &:hover {
    background: rgba(0, 102, 255, 0.1);
    box-shadow: 0 0 30px rgba(0, 102, 255, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
`;

export default function Shop() {
  const [selectedWindow, setSelectedWindow] = useState(null);

  const windows = [
    { 
      id: 1, 
      type: 'crown', 
      title: 'Limited Edition: Lil Durk Collectible Figure', 
      price: '$299.99' 
    },
    { id: 2, type: 'coming-soon', title: 'Coming Soon', price: 'TBA' },
    { id: 3, type: 'coming-soon', title: 'Coming Soon', price: 'TBA' }
  ];

  const renderWindowContent = (type, title) => {
    switch (type) {
      case 'crown':
        return (
          <>
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <CollectibleModel scrollProgress={0} />
              <OrbitControls 
                enableZoom={false}
                autoRotate={true}
                autoRotateSpeed={2}
              />
            </Canvas>
            <Title>Durk Figure</Title>
            <Price>$299.99</Price>
          </>
        );
      case 'coming-soon':
        return (
          <ComingSoonWindow>
            <ComingSoonText>Coming Soon</ComingSoonText>
          </ComingSoonWindow>
        );
      default:
        return null;
    }
  };

  return (
    <ShopSection id="shop">
      <WindowsContainer>
        {windows.map((window, index) => (
          index === 0 ? (
            <ShopWindow
              key={window.id}
              $isFirst={true}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedWindow(window)}
            >
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <CollectibleModel />
                <OrbitControls enableZoom={false} />
              </Canvas>
              <ExpandedTitle>Limited Edition: Lil Durk Collectible Figure</ExpandedTitle>
              <Price>$299.99</Price>
              <BuyButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Now
              </BuyButton>
            </ShopWindow>
          ) : (
            <ShopWindow
              key={window.id}
              $isFirst={index === 0}
              layoutId={`window-${window.id}`}
              onClick={() => setSelectedWindow(window)}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {renderWindowContent(window.type, window.title)}
            </ShopWindow>
          )
        ))}
      </WindowsContainer>

      <AnimatePresence>
        {selectedWindow && (
          <ExpandedWindow
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseButton onClick={() => setSelectedWindow(null)}>×</CloseButton>
            
            <motion.div layoutId={`window-${selectedWindow.id}`} style={{ width: '80%', height: '70%' }}>
              {renderWindowContent(selectedWindow.type, selectedWindow.title)}
            </motion.div>

            <ProductInfo
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {selectedWindow.type === 'crown' ? (
                <>
                  <div>
                    <ExpandedTitle>{selectedWindow.title}</ExpandedTitle>
                    <Price>{selectedWindow.price}</Price>
                  </div>
                  <BuyButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy Now
                  </BuyButton>
                </>
              ) : (
                <ComingSoonText>Coming Soon</ComingSoonText>
              )}
            </ProductInfo>
          </ExpandedWindow>
        )}
      </AnimatePresence>
    </ShopSection>
  );
}
