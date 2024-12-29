import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MatrixContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const GlowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(0, 102, 255, 0.2) 0%,
    transparent 70%
  );
  animation: pulse 4s ease-in-out infinite;

  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }
`;

const BlockchainSymbol = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid #0066FF;
  border-radius: 20px;
  transform: rotate(45deg);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: rotate 10s linear infinite;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: #0066FF;
    border-radius: 10px;
  }

  @keyframes rotate {
    from { transform: rotate(45deg); }
    to { transform: rotate(405deg); }
  }
`;

const BlockchainMatrix = () => {
  const canvasRef = useRef(null);
  const chars = 'ABCDEF0123456789';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const rows = [];
    const fontSize = 14;
    let positions = [];

    const initMatrix = () => {
      const rows = Math.floor(canvas.height / fontSize);
      positions = Array(rows).fill().map(() => ({
        x: -fontSize,
        y: Math.floor(Math.random() * canvas.height)
      }));
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0066FF';
      ctx.font = fontSize + 'px monospace';
      
      positions.forEach((pos, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, pos.x, pos.y);
        
        pos.x += fontSize;
        
        if (pos.x > canvas.width) {
          pos.x = -fontSize;
          pos.y = Math.floor(Math.random() * canvas.height);
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    initMatrix();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initMatrix();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <MatrixContainer>
      <Canvas ref={canvasRef} />
      <BlockchainSymbol />
      <GlowOverlay />
    </MatrixContainer>
  );
};

export default BlockchainMatrix;
