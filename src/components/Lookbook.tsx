import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from '../hooks/useInView';

// Define interface for Lookbook item
interface LookbookItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  images: string[];
  featured?: boolean;
}

// Enhanced mock data with better fashion images
const lookbookItems: LookbookItem[] = [
  {
    id: 1,
    title: 'Summer Elegance',
    subtitle: 'Bold and Bright',
    description: 'Discover the vibrant hues of our summer collection with flowing fabrics and contemporary cuts.',
    category: 'Summer',
    images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    featured: true,
  },
  {
    id: 2,
    title: 'Winter Charm',
    subtitle: 'Cozy and Chic',
    description: 'Embrace warmth with our winter essentials featuring luxurious textures and timeless silhouettes.',
    category: 'Winter',
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  {
    id: 3,
    title: 'Spring Bliss',
    subtitle: 'Fresh and Floral',
    description: 'Celebrate spring with our floral collection that captures the essence of renewal and growth.',
    category: 'Spring',
    images: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  {
    id: 4,
    title: 'Autumn Glow',
    subtitle: 'Warm and Earthy',
    description: 'Fall in love with our autumn tones featuring rich colors and sophisticated layering.',
    category: 'Autumn',
    images: ['https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  {
    id: 5,
    title: 'Urban Edge',
    subtitle: 'Modern and Sleek',
    description: 'Define your style with our urban collection that blends comfort with contemporary design.',
    category: 'Urban',
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  {
    id: 6,
    title: 'Bohemian Dream',
    subtitle: 'Free and Flowy',
    description: 'Express yourself with our bohemian vibes featuring artistic patterns and flowing silhouettes.',
    category: 'Bohemian',
    images: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
];

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// Define properly typed card animation variants
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 100,
    rotateX: -15,
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
    },
  },
  exit: { 
    opacity: 0, 
    y: -100,
    rotateX: 15,
    scale: 0.9,
    transition: { 
      duration: 0.5, 
      ease: "easeInOut" 
    },
  },
};

// Define properly typed animation variants
const floatingVariants: Variants = {
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Lookbook: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Spring animations
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lookbookItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle carousel navigation
  const handleNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % lookbookItems.length;
      }
      return prev - 1 < 0 ? lookbookItems.length - 1 : prev - 1;
    });
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleIndicatorClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentItem = lookbookItems[currentIndex];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-xl"
        />
      </div>

      <motion.div
        style={{ y: springY, scale: springScale, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={cardVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Lookbook
            </span>
            <br />
            <span className="text-white">Collection</span>
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Discover our curated fashion collections crafted to elevate your style with timeless elegance and contemporary sophistication.
          </motion.p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group relative w-full max-w-5xl mx-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main Card */}
              <motion.div
                whileHover={{ 
                  rotateY: 5,
                  rotateX: -5,
                  scale: 1.02,
                  z: 50,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20 cursor-pointer transform-gpu"
                onClick={() => navigate(`/shop-the-look/${currentItem.id}`)}
              >
                {/* Image Container */}
                <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                  <motion.img
                    src={currentItem.images[0]}
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 left-6"
                  >
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-500/90 text-white backdrop-blur-sm">
                      {currentItem.category}
                    </span>
                  </motion.div>

                  {/* Content Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-0 left-0 right-0 p-8"
                  >
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                      {currentItem.title}
                    </h3>
                    <p className="text-xl md:text-2xl text-amber-300 font-medium mb-4">
                      {currentItem.subtitle}
                    </p>
                    <p className="text-gray-200 text-lg max-w-2xl mb-6 leading-relaxed">
                      {currentItem.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/shop-the-look/${currentItem.id}`);
                        }}
                      >
                        Shop the Look
                      </motion.button>
                      
                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 z-10"
            onClick={() => handleNavigation('prev')}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 z-10"
            onClick={() => handleNavigation('next')}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-12">
          {lookbookItems.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-amber-500 shadow-lg shadow-amber-500/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>

        {/* Browse All Collections Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop-the-look')}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold px-12 py-4 rounded-full shadow-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-500 border border-white/20 backdrop-blur-sm"
          >
            Browse All Collections
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Lookbook;
