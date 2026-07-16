'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TiltedCard from '@/components/ui/TiltedCard';
import StatusBadge from '@/components/ui/StatusBadge';
import './NxOriginalsCarousel.css';

interface NxOriginal {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  status: string;
  statusDescription?: string;
  category: 'web' | 'mobile';
  link?: string | null;
}

const products: NxOriginal[] = [
  {
    id: 'shinkusen',
    name: 'SHINKUSEN',
    description: 'Faith × Anime Merch Store',
    imageSrc: '/images/placeholder-shinkusen.svg',
    status: 'In Development',
    statusDescription: 'Site coming soon',
    category: 'web',
    link: 'https://shinkusen.co.ke',
  },
  {
    id: 'betledger',
    name: 'Bet Ledger',
    description: 'Honest bet tracking analytics',
    imageSrc: '/images/Bet%20Ledger%20Card.png',
    status: 'In Testing',
    statusDescription: 'Coming to Play Store',
    category: 'mobile',
    link: null,
  },
  {
    id: 'hikarani',
    name: 'Hikarani',
    description: 'Faith Community App',
    imageSrc: '/images/placeholder-hikarani.svg',
    status: 'In Development',
    category: 'mobile',
    link: null,
  },
  {
    id: 'kikota',
    name: 'Kikota',
    description: 'Gym Management SaaS',
    imageSrc: '/images/placeholder-kikota.svg',
    status: 'In Development',
    category: 'web',
    link: null,
  },
  {
    id: 'no-snooze-alarm',
    name: 'No-Snooze Alarm',
    description: "The Alarm That Won't Quit",
    imageSrc: '/images/placeholder-no-snooze.svg',
    status: 'In Development',
    category: 'mobile',
    link: null,
  },
  {
    id: 'matatu-dash',
    name: 'Matatu Dash',
    description: 'Mobile Game',
    imageSrc: '/images/placeholder-matatu-dash.svg',
    status: 'In Development',
    category: 'mobile',
    link: null,
  },
];

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

  const card = (
    <div style={{ position: 'relative' }}>
      <TiltedCard
        imageSrc={current.imageSrc}
        altText={current.name}
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
            {current.link ? (
              <Link href={current.link} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                {card}
              </Link>
            ) : (
              card
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
          {current.name}
        </h3>
        <p
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            color: 'rgba(245,245,245,0.7)',
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
            aria-label={`Go to ${product.name}`}
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
            title={product.name}
          />
        ))}
      </div>
    </div>
  );
}
