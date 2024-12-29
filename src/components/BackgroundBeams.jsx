import React from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import blueprintSvg from '../assets/crownmania_blueprint.svg';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
`;

const Background = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh;
  background-image: url(${blueprintSvg});
  background-size: 40%;
  background-position: center;
  background-repeat: repeat;
  opacity: 0.05;
  filter: brightness(0) invert(1);
`;

const BackgroundBeams = () => {
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '-50%']
  );

  return (
    <BackgroundContainer>
      <Background style={{ y }} />
    </BackgroundContainer>
  );
};

export default BackgroundBeams;
