import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { FaHome, FaShoppingBag, FaLock, FaInfoCircle, FaEnvelope, FaComments } from 'react-icons/fa';
import crownLogo from '../assets/crown_logo_white.svg';
import BackgroundBeams from './BackgroundBeams';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(
      180deg,
      rgba(2, 6, 23, 0.95) 0%,
      rgba(2, 6, 23, 0.8) 25%,
      rgba(2, 6, 23, 0.4) 50%,
      rgba(2, 6, 23, 0.2) 75%,
      rgba(2, 6, 23, 0) 100%
    );
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(0, 102, 255, 0) 0%,
      rgba(0, 102, 255, 0.2) 25%,
      rgba(0, 102, 255, 0.4) 50%,
      rgba(0, 102, 255, 0.2) 75%,
      rgba(0, 102, 255, 0) 100%
    );
    z-index: -1;
  }
`;

const BlurOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  z-index: 100;
  transition: opacity 0.3s ease;

  &.active {
    opacity: 1;
    pointer-events: auto;
  }
`;

const HalftoneOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-color: transparent;
  background-image: radial-gradient(transparent 1px, var(--dark-blue) 1px);
  background-size: 4px 4px;
  mask: linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%);
  opacity: 0.3;
  pointer-events: none;
  z-index: 99;
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
  }
`;

const LogoIcon = styled.img`
  height: 32px;
  width: 32px;
`;

const Logo = styled.div`
  font-family: 'Designer', sans-serif;
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  color: white;
`;

const HamburgerButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 102;
  padding: 0;
`;

const HamburgerLine = styled(motion.span)`
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  margin: 5px auto;
`;

const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 200px;
  height: 100vh;
  background: transparent;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 101;
  padding: 5rem 0.5rem 2rem;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transform: translateY(${props => (props.$isOpen ? '0' : '-10px')});
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition: all 0.3s ease;
`;

const MenuItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-family: 'Avenir Next', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  cursor: pointer;

  svg {
    font-size: 1rem;
    min-width: 16px;
  }

  &:hover {
    color: var(--light-blue);
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const MenuItemText = styled.span`
  display: inline-block;
  letter-spacing: 0.02em;
`;

const menuVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.04,
      delayChildren: 0.1
    }
  }
};

const menuItemVariants = {
  closed: {
    x: 20,
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const menuItems = [
    { text: 'Home', icon: <FaHome size={16} />, link: '/' },
    { text: 'Shop', icon: <FaShoppingBag size={16} />, link: '/#shop' },
    { text: 'Vault', icon: <FaLock size={16} />, link: '/#vault' },
    { text: 'About', icon: <FaInfoCircle size={16} />, link: '/#about' },
    { text: 'Forum', icon: <FaComments size={16} />, link: '/forum' },
    { text: 'Contact', icon: <FaEnvelope size={16} />, link: '/contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or at the top
        setShowHeader(true);
      } else {
        // Scrolling down
        setShowHeader(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleTouchStart = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('keydown', handleEscape);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <BackgroundBeams />
      <HeaderContainer style={{ opacity: headerOpacity }} $show={showHeader}>
        <LogoLink href="#" onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}>
          <LogoIcon src={crownLogo} alt="Crownmania Logo" />
          <Logo>CROWNMANIA</Logo>
        </LogoLink>
        
        <HamburgerButton 
          onClick={toggleMenu}
          ref={buttonRef}
        >
          <HamburgerLine 
            animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} 
          />
          <HamburgerLine 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <HamburgerLine 
            animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          />
        </HamburgerButton>
      </HeaderContainer>

      <HalftoneOverlay />

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <BlurOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className={isMenuOpen ? 'active' : ''}
            />
            <MenuOverlay
              ref={menuRef}
              $isOpen={isMenuOpen}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {menuItems.map((item, i) => (
                <MenuItem
                  key={item.text}
                  href={item.link}
                  custom={i}
                  variants={menuItemVariants}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <MenuItemText>{item.text}</MenuItemText>
                </MenuItem>
              ))}
            </MenuOverlay>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
