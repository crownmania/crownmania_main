import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import QrReader from 'react-qr-scanner';
import CollectibleModel from './3d/CollectibleModel';
import NFTModel from './3d/NFTModel';
import GlowButton from './GlowButton';

const VaultSection = styled.section`
  min-height: 100vh;
  padding: 6rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const WindowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const VaultWindow = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  overflow: hidden;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 0 20px rgba(0, 0, 255, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(0, 102, 255, 0.1),
      transparent
    );
    mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
                 linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 5px 30px rgba(0, 102, 255, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
`;

const WindowContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
`;

const WindowTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFFFFF, #0066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatusDot = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#0066FF' : '#FFFFFF'};
  box-shadow: 0 0 10px ${props => props.$isActive ? '#0066FF' : '#FFFFFF'};
`;

const ExpandedContent = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background: rgba(2, 6, 23, 0.95);
  border-radius: 24px;
  padding: 2rem;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(0, 0, 255, 0.2);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(10px);
  z-index: 99;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #0066FF;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #FFFFFF;
  opacity: 0.8;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  text-align: center;
`;

const VaultContainer = styled(motion.div)`
  min-height: 100vh;
  background: var(--dark-blue);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  filter: ${props => props.isLocked ? 'saturate(0.7)' : 'saturate(1)'};
  transition: filter 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, 
      ${props => props.isLocked ? 
        'rgba(var(--light-blue-rgb), 0.05) 0%, rgba(var(--dark-blue-rgb), 0.02) 50%, transparent 100%' :
        'rgba(0, 255, 255, 0.1) 0%, rgba(15, 76, 129, 0.05) 50%, transparent 100%'
      });
    pointer-events: none;
  }
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  background: rgba(15, 76, 129, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: 'Designer', sans-serif;
  font-size: 1.8rem;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  margin: 0;
  background: linear-gradient(135deg, #E2CBFF, #393BB2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #0066FF;
  color: #0066FF;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 102, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  height: calc(100vh - 200px);
  margin-top: 2rem;
`;

const Panel = styled(motion.div)`
  background: rgba(var(--dark-blue-rgb), 0.3);
  border: 1px solid ${props => props.isVerified ? 
    'rgba(0, 255, 255, 0.2)' : 
    'rgba(var(--light-blue-rgb), 0.1)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  height: fit-content;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.isVerified ? 
      'rgba(0, 255, 255, 0.3)' : 
      'rgba(var(--light-blue-rgb), 0.2)'
    };
    box-shadow: 0 0 30px ${props => props.isVerified ? 
      'rgba(0, 255, 255, 0.1)' : 
      'rgba(var(--light-blue-rgb), 0.1)'
    };
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(226, 203, 255, 0.2),
      rgba(57, 59, 178, 0.2)
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover::before {
    transform: translateY(-2px);
    box-shadow: 
      0 0 30px rgba(57, 59, 178, 0.2),
      inset 0 0 30px rgba(226, 203, 255, 0.1);
  }
`;

const ModelDisplay = styled(Panel)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #00ffff 50%, 
      transparent 100%
    );
    box-shadow: 0 0 20px #00ffff;
    opacity: ${props => props.isLocked ? 0.3 : 1};
    transition: opacity 0.5s ease;
  }
`;

const NFTDisplay = styled(Panel)`
  height: 300px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const LockOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
  font-size: 1.1rem;
  backdrop-filter: blur(5px);
`;

const VerificationSection = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  color: #00ffff;
  width: 100%;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  }
`;

const VerifyButton = styled(GlowButton)`
  width: 100%;
  margin-top: 1rem;
  background: rgba(0, 255, 255, 0.1);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingBar = styled(motion.div)`
  height: 2px;
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff;
  margin-top: 1rem;
`;

const StatusPanel = styled(Panel)`
  margin-top: 1rem;
`;

const VerificationStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 1rem;

  h4 {
    margin: 0;
    font-size: 1rem;
  }
`;

export default function Vault() {
  const [isLocked, setIsLocked] = useState(true);
  const [serialNumber, setSerialNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [activeStates, setActiveStates] = useState({
    vault: true,
    assets: false,
    security: false
  });

  const windows = [
    {
      id: 'vault',
      title: 'Vault Access',
      description: 'Secure storage for your digital assets',
      stats: {
        assets: '147',
        value: '$2.4M',
        growth: '+24%'
      }
    },
    {
      id: 'assets',
      title: 'Asset Management',
      description: 'Track and manage your collection',
      stats: {
        nfts: '89',
        tokens: '58',
        trades: '234'
      }
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure your vault security',
      stats: {
        score: '98%',
        checks: '12/12',
        days: '142'
      }
    }
  ];

  const handleVerification = () => {
    if (!serialNumber || isVerifying) return;
    
    setIsVerifying(true);
    setVerificationStep(1);
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStep(2);
      const isValid = serialNumber === '123456';
      setVerificationStatus(isValid ? 'verified' : 'invalid');
      setIsVerifying(false);
      setIsLocked(!isValid);
    }, 2000);
  };

  const handleWindowClick = (window) => {
    setSelectedWindow(window);
    setActiveStates(prev => ({
      ...prev,
      [window.id]: true
    }));
  };

  return (
    <VaultSection id="vault">
      <WindowsGrid>
        {windows.map((window) => (
          <VaultWindow
            key={window.id}
            onClick={() => handleWindowClick(window)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatusDot $isActive={activeStates[window.id]} />
            <WindowContent>
              <div>
                <WindowTitle>{window.title}</WindowTitle>
                <p>{window.description}</p>
              </div>
              <ButtonContainer>
                <GlowButton>Access</GlowButton>
              </ButtonContainer>
            </WindowContent>
          </VaultWindow>
        ))}
      </WindowsGrid>

      <AnimatePresence>
        {selectedWindow && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWindow(null)}
            />
            <ExpandedContent
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <WindowTitle>{selectedWindow.title}</WindowTitle>
              <Stats>
                {Object.entries(selectedWindow.stats).map(([key, value]) => (
                  <div key={key}>
                    <StatValue>{value}</StatValue>
                    <StatLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                  </div>
                ))}
              </Stats>
              <ButtonContainer>
                <GlowButton onClick={() => setSelectedWindow(null)}>Close</GlowButton>
              </ButtonContainer>
            </ExpandedContent>
          </>
        )}
      </AnimatePresence>

      <VaultContainer isLocked={isLocked}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Title>The Vault - Authenticate, Verify, and Claim Your Digital Ownership</Title>
          <HeaderButtons>
            <GlowButton>Sign In</GlowButton>
            <GlowButton>Connect Wallet</GlowButton>
          </HeaderButtons>
        </Header>

        <MainContent>
          <div>
            <Panel>
              <h3>Collectible Details</h3>
              {verificationStatus === 'verified' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p>Collection: Crown Series 1</p>
                  <p>Edition: #45 of 500</p>
                  <p>Minted: December 13, 2024</p>
                </motion.div>
              )}
            </Panel>
            
            <NFTDisplay>
              {verificationStatus === 'verified' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                    <ambientLight intensity={0.3} />
                    <NFTModel />
                  </Canvas>
                </motion.div>
              ) : (
                <LockOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>🔒 Verify to Unlock Digital Token</span>
                </LockOverlay>
              )}
            </NFTDisplay>
          </div>

          <ModelDisplay isLocked={isLocked}>
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <CollectibleModel isLocked={isLocked} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </ModelDisplay>

          <div>
            <VerificationSection>
              <h3>Verify Your Collectible</h3>
              <Input
                type="text"
                placeholder="Enter Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
              <VerifyButton
                onClick={handleVerification}
                disabled={!serialNumber || isVerifying}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Verification
              </VerifyButton>
              {isVerifying && (
                <LoadingBar
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              )}
            </VerificationSection>

            <StatusPanel>
              <VerificationStatus
                status={verificationStatus}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4>
                  {verificationStatus === 'verified' ? '✓ Verified Authentic' :
                   verificationStatus === 'invalid' ? '✗ Invalid Serial Number' :
                   '⋯ Awaiting Verification'}
                </h4>
              </VerificationStatus>
            </StatusPanel>

            {verificationStatus === 'verified' && (
              <VerifyButton
                as={motion.button}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Claim Digital Collectible
              </VerifyButton>
            )}
          </div>
        </MainContent>
      </VaultContainer>
    </VaultSection>
  );
}
