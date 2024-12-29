import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimationFrame } from 'framer-motion';

const GallerySection = styled.section`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductsContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 2rem;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  will-change: transform;
  transform: translateX(0);

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ProductContainer = styled.div`
  flex: 0 0 auto;
  width: calc(33.333% - 2rem);
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  will-change: transform;
  transform: translateZ(0);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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

  @media (max-width: 768px) {
    width: calc(100% - 2rem);
    height: 400px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  will-change: transform;
  transform: translateZ(0);
  filter: brightness(0.9) contrast(1.1);
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1) contrast(1);
  }
`;

const products = [
  '/images/product1.webp',
  '/images/product2.webp',
  '/images/product3.webp',
  '/images/product4.webp',
  '/images/product5.webp'
];

const tripledProducts = [...products, ...products, ...products];

export default function Gallery() {
  const trackRef = useRef(null);
  const scrollRef = useRef(0);
  const speedRef = useRef(0.5);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useEffect(() => {
    // Preload images
    products.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImagesLoaded(prev => prev + 1);
    });
  }, []);

  useAnimationFrame(() => {
    if (!trackRef.current || imagesLoaded < products.length) return;

    scrollRef.current -= speedRef.current;
    const itemWidth = trackRef.current.children[0].offsetWidth + 32;
    const totalWidth = itemWidth * products.length;

    if (Math.abs(scrollRef.current) >= totalWidth) {
      scrollRef.current = 0;
    }

    trackRef.current.style.transform = `translateX(${scrollRef.current}px)`;
  });

  return (
    <GallerySection id="gallery">
      <ProductsContainer>
        <CarouselTrack ref={trackRef}>
          {tripledProducts.map((src, index) => (
            <ProductContainer key={`${src}-${index}`}>
              <ProductImage
                src={src}
                alt={`Product ${(index % products.length) + 1}`}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
              />
            </ProductContainer>
          ))}
        </CarouselTrack>
      </ProductsContainer>
    </GallerySection>
  );
}
