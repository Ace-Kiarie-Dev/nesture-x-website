'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TiltedCard from '@/components/ui/TiltedCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { NX_ORIGINALS } from '@/data/nxOriginals';
import { getProjectDestination } from '@/lib/getProjectDestination';
import './NxOriginalsCarousel.css';

const products = NX_ORIGINALS;

const AUTOPLAY_INTERVAL = 10000;
const RESUME_DELAY = 8000;

export default function NxOriginalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [autoplay]);

  const pauseThenResume = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), RESUME_DELAY);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseThenResume();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    pauseThenResume();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    pauseThenResume();
  };

  const current = products[currentIndex];
  const destination = getProjectDestination(current.link, current.slug);

  const card = (
    <div style={{ position: 'relative' }}>
      <TiltedCard
        imageSrc={current.imageSrc}
        altText={current.title}
        containerHeight="260px"
        containerWidth="100%"
        imageHeight="260px"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.05}
        showMobileWarning={false}
        showTooltip={false}
      />
      <StatusBadge label={current.status} description={current.statusDescription} />
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
      }}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Carousel Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Same destination rule as the portfolio project cards: a live
                link wins (e.g. SHINKUSEN → shinkusen.co.ke, external); everything
                else goes to that project's shared status page. */}
            {destination.isExternal ? (
              <Link href={destination.href} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                {card}
              </Link>
            ) : (
              <Link href={destination.href} style={{ cursor: 'pointer' }}>
                {card}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous product"
          className="nx-carousel-arrow nx-carousel-arrow--prev"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next product"
          className="nx-carousel-arrow nx-carousel-arrow--next"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      {/* Product Info Below Carousel */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {current.title}
        </h3>
        <p
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {current.description}
        </p>
      </div>

      {/* Dot Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {products.map((product, index) => (
          <button
            key={product.id}
            onClick={() => goToSlide(index)}
            aria-label={`Go to ${product.title}`}
            aria-current={currentIndex === index}
            style={{
              width: currentIndex === index ? '28px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: '1px solid var(--color-primary)',
              backgroundColor: currentIndex === index ? 'var(--color-primary)' : 'transparent',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
            title={product.title}
          />
        ))}
      </div>
    </div>
  );
}
