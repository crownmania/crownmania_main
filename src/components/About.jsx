import React from 'react';
import styled from 'styled-components';
import BlockchainMatrix from './BlockchainMatrix';
import CobeGlobe from './CobeGlobe';

const AboutSection = styled.section`
  min-height: 100vh;
  padding: 6rem 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WindowsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const Window = styled.div`
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const GlobeWindow = styled(Window)`
  position: relative;
  
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
`;

export default function About() {
  return (
    <AboutSection id="about">
      <WindowsContainer>
        <Window>
          {/* First window content */}
        </Window>
        
        <Window>
          <BlockchainMatrix />
        </Window>
        
        <GlobeWindow>
          <CobeGlobe />
        </GlobeWindow>
      </WindowsContainer>
    </AboutSection>
  );
}
