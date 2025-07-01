import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Share2,
  ShoppingBag,
  ArrowLeft,
  Eye,
  Palette,
  //Scissors,
  Sparkles,
  Calendar,
  //Tag,
  Users,
  TrendingUp,
  //Award,
  CheckCircle,
  Plus,
  Minus,
  ZoomIn
} from 'lucide-react';
import { lookbookItems } from '../data/Lookbook';
import { products } from '../data/products';

const ShopLookbook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [currentLookbookIndex, setCurrentLookbookIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Get lookbook data
  const lookbook = lookbookItems.find((item) => item.id === id);
  const lookbookProducts = lookbook ? products.filter((product) =>
    lookbook.productIds.includes(product.id)
  ) : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] as const }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (lookbook) {
      const index = lookbookItems.findIndex(item => item.id === id);
      setCurrentLookbookIndex(index);
    }
  }, [id, lookbook]);

  // Handlers
  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!lookbook) return;
    setCurrentImageIndex((prev) => {
      if (direction === 'next') {
        return prev + 1 >= lookbook.images.length ? 0 : prev + 1;
      }
      return prev - 1 < 0 ? lookbook.images.length - 1 : prev - 1;
    });
  };

  const handleProductLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleNavigateLookbook = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentLookbookIndex + 1) % lookbookItems.length
      : (currentLookbookIndex - 1 + lookbookItems.length) % lookbookItems.length;
    navigate(`/shop-lookbook/${lookbookItems[newIndex].id}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lookbook?.title,
          text: lookbook?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading lookbook...</p>
        </motion.div>
      </div>
    );
  }

  // Not found state
  if (!lookbook) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
              Discover Our Lookbooks
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Explore our curated fashion collections designed to inspire and elevate your personal style
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {lookbookItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
                onClick={() => navigate(`/shop-lookbook/${item.id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl font-serif font-bold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.subtitle}</p>
                  </div>
                  {item.featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className="text-sm text-gray-500">{item.season}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-600">
                      {item.productIds.length} pieces
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-amber-600 transition-colors duration-300 flex items-center space-x-3 mx-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Navigation Header */}
      <motion.div
        variants={itemVariants}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Lookbook</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">{lookbook.title}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleNavigateLookbook('prev')}
                  className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleNavigateLookbook('next')}
                  className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section variants={itemVariants} className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative h-[70vh] min-h-[600px]"
              >
                <img
                  src={lookbook.images[currentImageIndex]}
                  alt={`${lookbook.title} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            {/* Image Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-6">
              <button
                onClick={() => handleImageChange('prev')}
                className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all group"
              >
                <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleImageChange('next')}
                className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all group"
              >
                <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {lookbook.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            {/* Zoom Button */}
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <ZoomIn className="h-5 w-5 text-white" />
            </button>

            {/* Hero Text */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-12 left-12 text-white max-w-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full">
                  {lookbook.season}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {lookbook.mood}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                {lookbook.title}
              </h1>
              <p className="text-xl md:text-2xl mb-6 leading-relaxed font-light">
                {lookbook.subtitle}
              </p>
              <p className="text-lg leading-relaxed opacity-90">
                {lookbook.description}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Lookbook Details */}
      <motion.section variants={itemVariants} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
                The Story Behind
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {lookbook.longDescription}
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Palette className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspiration</h3>
                    <p className="text-gray-600">{lookbook.inspiration}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Season</h3>
                    <p className="text-gray-600">{lookbook.season}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mood</h3>
                    <p className="text-gray-600">{lookbook.mood}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {lookbook.images.slice(0, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`relative overflow-hidden rounded-2xl ${
                      index === 0 ? 'col-span-2 h-64' : 'h-48'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${lookbook.title} detail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Styling Tips */}
      {lookbook.stylingTips && (
        <motion.section variants={itemVariants} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                Styling Tips
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert advice to help you master this look
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lookbook.stylingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Products Section */}
      <motion.section variants={itemVariants} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Shop This Look
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the carefully curated pieces that make this look complete
            </p>
          </div>

          {lookbookProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {lookbookProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                        {product.category}
                      </span>
                      {product.isSale && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          SALE
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleProductLike(product.id)}
                        className={`h-10 w-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                          likedProducts.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition-all"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium shadow-lg hover:bg-amber-600 hover:text-white transition-colors duration-300"
                      >
                        Quick Add to Cart
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-serif font-semibold text-gray-900 group-hover:text-amber-600 transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </div>
                        {product.originalPrice && (
                          <div className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-base mb-6 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Color Options */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">Colors</span>
                        <span className="text-xs text-gray-500">{product.colors.length} options</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.colors.slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-gray-500 ml-2">
                            +{product.colors.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Size Options */}
                    {product.sizes && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-900">Sizes</span>
                          <span className="text-xs text-gray-500">{product.sizes.length} sizes</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          {product.sizes.slice(0, 6).map((size, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                size.inStock
                                  ? 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {size.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Qty:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {quantities[product.id] || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
                      >
                        View
                      </motion.button>
                    </div>

                    {/* Features */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        {product.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-gray-50 rounded-3xl"
            >
              <div className="max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  We're curating the perfect pieces for this look. Check back soon for amazing additions!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-amber-600 transition-colors duration-300"
                >
                  Browse All Products
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Related Lookbooks */}
      <motion.section variants={itemVariants} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Explore More Looks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover other inspiring collections to complete your wardrobe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {lookbookItems
              .filter((item) => item.id !== id)
              .slice(0, 3)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
                  onClick={() => navigate(`/shop-lookbook/${item.id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-2xl font-serif font-bold mb-2">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.subtitle}</p>
                    </div>
                    {item.featured && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-serif font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-sm text-gray-500">{item.season}</span>
                    </div>
                    <p className="text-gray-600 text-base line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {item.productIds.length} pieces
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-amber-600 transition-colors duration-300 flex items-center space-x-3 mx-auto"
            >
              <span>View All Lookbooks</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
            >
              <img
                src={lookbook.images[currentImageIndex]}
                alt={`${lookbook.title} zoomed`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopLookbook;
