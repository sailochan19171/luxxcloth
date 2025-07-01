import React, { useState, useMemo, useEffect, useRef, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Grid,
  List,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  X,
  Eye,
  RefreshCw,
  Sparkles,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  ArrowUpDown,
} from "lucide-react";
import { products } from "../data/products";
import LazyImage from "./LazyImage";
import type { Product } from "../types";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useReferral } from "./useReferral";
import type { ReferralDiscount } from "../context/ReferralContext";
import { calculateDiscountedPrice } from "../components/DiscountUtils";

// Lazy-load VirtualTryOn
const VirtualTryOn = lazy(() => import("./VirtualTryOn"));

// ErrorBoundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center border border-red-200">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Extended interfaces
interface FilterState {
  category: string;
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  tags: string[];
  inStockOnly: boolean;
}

// Categories, colors, sizes, tags, and price range
const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
const colors = Array.from(new Set(products.flatMap((product) => product.colors.map((c) => c.name))));
const sizes = ["XS", "S", "M", "L", "XL", "XXL"].filter((size) =>
  products.some((product) => product.sizes?.some((s) => s.name === size)),
);
const minPrice = products.length > 0 ? Math.floor(Math.min(...products.map((p) => p.price))) : 0;
const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map((p) => p.price))) : 1500;

// Featured collections
const featuredCollections = [
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Discover the latest trends",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "bestsellers",
    title: "Bestsellers",
    subtitle: "Customer favorites",
    image: "https://images.unsplash.com/photo-1598032895397-b9472444df3f?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "luxury",
    title: "Premium Collection",
    subtitle: "Curated excellence",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=2400&q=80",
  },
];

const Collections: React.FC = () => {
  const navigate = useNavigate();
  const { state, redeemDiscount } = useReferral();
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const saved = localStorage.getItem("filterState");
    return saved
      ? JSON.parse(saved)
      : {
          category: "All",
          priceRange: [minPrice, maxPrice],
          colors: [],
          sizes: [],
          tags: [],
          inStockOnly: false,
        };
  });
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['category', 'price']));
  const filtersRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const productsPerPage = 12;

  // Debug state changes
  useEffect(() => {
    console.log("Collections: selectedProduct changed:", selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    console.log("Collections: isTryOnOpen changed:", isTryOnOpen);
  }, [isTryOnOpen]);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem("filterState", JSON.stringify(filterState));
  }, [filterState]);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filterState, sortBy, searchQuery]);

  // Carousel navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredCollections.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + featuredCollections.length) % featuredCollections.length);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node) && showFilters) {
        setShowFilters(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node) && showSortDropdown) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters, showSortDropdown]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // Filter handlers
  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numValue = value === "" ? (index === 0 ? minPrice : maxPrice) : Number.parseInt(value);
    if (isNaN(numValue)) return;
    setFilterState((prev) => ({
      ...prev,
      priceRange: [
        index === 0 ? Math.max(minPrice, Math.min(numValue, prev.priceRange[1])) : prev.priceRange[0],
        index === 1 ? Math.min(maxPrice, Math.max(numValue, prev.priceRange[0])) : prev.priceRange[1],
      ],
    }));
  };

  const handleRangeSliderChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = Number.parseInt(e.target.value);
    setFilterState((prev) => ({
      ...prev,
      priceRange: [index === 0 ? value : prev.priceRange[0], index === 1 ? value : prev.priceRange[1]],
    }));
  };

  const toggleColor = (color: string) => {
    setFilterState((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }));
  };

  const toggleSize = (size: string) => {
    setFilterState((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  const toggleFilterExpansion = (filterName: string) => {
    setExpandedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterName)) {
        newSet.delete(filterName);
      } else {
        newSet.add(filterName);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setFilterState({
      category: "All",
      priceRange: [minPrice, maxPrice],
      colors: [],
      sizes: [],
      tags: [],
      inStockOnly: false,
    });
    setSearchQuery("");
    setSortBy("rating");
    setCurrentPage(1);
  };

  // Other handlers
  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Added ${product.name} to cart`);

    // Apply the highest available discount for both referrer and referred
    const { appliedDiscount } = calculateDiscountedPrice(product.price, state.discounts);
    if (appliedDiscount) {
      await redeemDiscount(appliedDiscount.id);
    }
  };

  const handleTryOn = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // Validate product before setting
    if (!product || !product.id || !product.name || !product.colors || product.colors.length === 0) {
      console.error("Collections: Invalid product for virtual try-on:", product);
      alert("This product cannot be tried on due to missing data. Please try another product.");
      return;
    }
    console.log("Collections: Opening VirtualTryOn with product:", product);
    
    // Set the product and open modal simultaneously
    setSelectedProduct(product);
    setIsTryOnOpen(true);
  };

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const trackRecentlyViewed = (product: Product) => {
    if (!recentlyViewed.some((p) => p.id === product.id)) {
      setRecentlyViewed([product, ...recentlyViewed].slice(0, 5));
    }
  };

  const openProductDetail = (product: Product) => {
    trackRecentlyViewed(product);
    navigate(`/product/${product.id}`);
  };

  // Check if product supports virtual try-on
  const canTryOn = (product: Product) => {
    return product.canTryOn && ["Outerwear", "Dresses", "Blazers", "Knitwear", "Shirts"].includes(product.category);
  };

  // Close virtual try-on modal
  const closeTryOnModal = () => {
    console.log("Collections: Closing VirtualTryOn");
    setIsTryOnOpen(false);
    setSelectedProduct(null);
  };

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = filterState.category === "All" || product.category === filterState.category;
      const matchesPrice = product.price >= filterState.priceRange[0] && product.price <= filterState.priceRange[1];
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !filterState.inStockOnly || product.inStock;
      const matchesColors =
        filterState.colors.length === 0 || product.colors.some((c) => filterState.colors.includes(c.name));
      const matchesSizes =
        filterState.sizes.length === 0 || product.sizes?.some((s) => filterState.sizes.includes(s.name));
      const matchesTags = filterState.tags.length === 0 || product.tags?.some((t) => filterState.tags.includes(t));
      return (
        matchesCategory && matchesPrice && matchesSearch && matchesStock && matchesColors && matchesSizes && matchesTags
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviews - a.reviews;
        case "quality":
          return b.rating * 0.7 + b.reviews * 0.3 - (a.rating * 0.7 + a.reviews * 0.3);
        case "discount": {
          const aDiscount = calculateDiscountedPrice(a.price, state.discounts).appliedDiscount?.discount_percentage || 0;
          const bDiscount = calculateDiscountedPrice(b.price, state.discounts).appliedDiscount?.discount_percentage || 0;
          return bDiscount - aDiscount;
        }
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [filterState, sortBy, searchQuery, state.discounts]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // Animation variants
  const filterVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "quality", label: "Best Quality" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
    { value: "discount", label: "Biggest Discount" },
    { value: "name", label: "Name (A-Z)" },
  ];

  const activeFiltersCount = 
    (filterState.category !== "All" ? 1 : 0) +
    (filterState.colors.length > 0 ? 1 : 0) +
    (filterState.sizes.length > 0 ? 1 : 0) +
    (filterState.tags.length > 0 ? 1 : 0) +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.priceRange[0] !== minPrice || filterState.priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Referral Discount Banner */}
      {state.discounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 text-white text-center py-3 sticky top-0 z-50 shadow-sm"
        >
          <p className="text-sm font-medium">
            🎉 You have {state.discounts.length} active referral {state.discounts.length === 1 ? "discount" : "discounts"}!{" "}
            Up to {Math.max(...state.discounts.map((d: ReferralDiscount) => d.discount_percentage))}% off your next
            purchase.
          </p>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
                <p className="text-sm text-gray-500 mt-1">Discover our curated selection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 bg-white text-gray-900 placeholder-gray-500 text-sm"
                  aria-label="Search products"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Carousel */}
      <div className="relative bg-white" {...swipeHandlers}>
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden h-80">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {featuredCollections.map((collection) => (
                <div key={collection.id} className="w-full flex-shrink-0 relative">
                  <LazyImage src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-lg text-white"
                      >
                        <h2 className="text-4xl font-bold mb-3">{collection.title}</h2>
                        <p className="text-lg mb-6 text-gray-200">{collection.subtitle}</p>
                        <button
                          onClick={() =>
                            setFilterState((prev) => ({
                              ...prev,
                              category: collection.title.includes("Premium")
                                ? "Accessories"
                                : collection.title.includes("New")
                                ? "Outerwear"
                                : "Jeans",
                            }))
                          }
                          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                          aria-label={`Explore ${collection.title}`}
                        >
                          Explore Collection
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-900 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-900 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredCollections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Sort options"
              >
                <ArrowUpDown size={16} />
                <span className="font-medium">Sort</span>
                <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          sortBy === option.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Clear all filters"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium">Clear all</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> of{" "}
              <span className="font-semibold">{products.length}</span> products
            </p>
            
            {/* Mobile Search */}
            <div className="relative sm:hidden">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 w-48 text-sm"
                aria-label="Search products (mobile)"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                ref={filtersRef}
                className="fixed inset-0 lg:relative lg:inset-auto z-50 lg:w-80 bg-white lg:bg-transparent"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="h-full lg:h-auto bg-white lg:bg-gray-50 lg:rounded-xl lg:border lg:border-gray-200 p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
                      aria-label="Close filters"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <button
                        onClick={() => toggleFilterExpansion('category')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h4>
                        {expandedFilters.has('category') ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedFilters.has('category') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-2"
                          >
                            {categories.map((category) => (
                              <button
                                key={category}
                                onClick={() => {
                                  setFilterState((prev) => ({ ...prev, category }));
                                  setShowFilters(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                  filterState.category === category
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                                aria-label={`Select category ${category}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{category}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    filterState.category === category 
                                      ? "bg-blue-500 text-white" 
                                      : "bg-gray-200 text-gray-600"
                                  }`}>
                                    {category === "All"
                                      ? products.length
                                      : products.filter((p) => p.category === category).length}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Price Range */}
                    <div>
                      <button
                        onClick={() => toggleFilterExpansion('price')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h4>
                        {expandedFilters.has('price') ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedFilters.has('price') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-4"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="number"
                                placeholder="Min"
                                value={filterState.priceRange[0] === minPrice ? "" : filterState.priceRange[0]}
                                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                                min={minPrice}
                                max={filterState.priceRange[1]}
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                                aria-label="Minimum price"
                              />
                              <span className="text-gray-400">–</span>
                              <input
                                type="number"
                                placeholder="Max"
                                value={filterState.priceRange[1] === maxPrice ? "" : filterState.priceRange[1]}
                                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                                min={filterState.priceRange[0]}
                                max={maxPrice}
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                                aria-label="Maximum price"
                              />
                            </div>
                            
                            <div className="relative px-2">
                              <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={filterState.priceRange[0]}
                                onChange={(e) => handleRangeSliderChange(e, 0)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none slider-thumb"
                                style={{ zIndex: 2 }}
                                aria-label="Minimum price range"
                              />
                              <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={filterState.priceRange[1]}
                                onChange={(e) => handleRangeSliderChange(e, 1)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none slider-thumb"
                                style={{ zIndex: 1 }}
                                aria-label="Maximum price range"
                              />
                              <div
                                className="h-2 bg-blue-600 rounded-lg absolute"
                                style={{
                                  left: `${((filterState.priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                                  width: `${
                                    ((filterState.priceRange[1] - filterState.priceRange[0]) / (maxPrice - minPrice)) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-900">
                                ${filterState.priceRange[0]} – ${filterState.priceRange[1]}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Colors */}
                    <div>
                      <button
                        onClick={() => toggleFilterExpansion('colors')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Colors</h4>
                        {expandedFilters.has('colors') ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedFilters.has('colors') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 grid grid-cols-2 gap-2"
                          >
                            {colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => toggleColor(color)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  filterState.colors.includes(color)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                                aria-label={`Toggle color ${color}`}
                              >
                                {color}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sizes */}
                    <div>
                      <button
                        onClick={() => toggleFilterExpansion('sizes')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Sizes</h4>
                        {expandedFilters.has('sizes') ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedFilters.has('sizes') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 grid grid-cols-3 gap-2"
                          >
                            {sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  filterState.sizes.includes(size)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                                aria-label={`Toggle size ${size}`}
                              >
                                {size}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Stock Availability */}
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterState.inStockOnly}
                          onChange={() => setFilterState((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900">In Stock Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <div className="flex-1">
            {/* Products Grid/List */}
            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="text-gray-600 mt-4 text-sm">Loading products...</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {viewMode === "grid" ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={gridVariants}
                  >
                    {paginatedProducts.map((product) => {
                      const { discountedPrice, appliedDiscount } = calculateDiscountedPrice(product.price, state.discounts);
                      return (
                        <motion.div
                          key={product.id}
                          variants={cardVariants}
                          className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
                          onClick={() => openProductDetail(product)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && openProductDetail(product)}
                        >
                          <div className="relative overflow-hidden">
                            <LazyImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {(product.originalPrice || appliedDiscount) && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                {appliedDiscount
                                  ? `${appliedDiscount.discount_percentage}% OFF`
                                  : product.originalPrice
                                  ? `${Math.round(
                                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                                    )}% OFF`
                                  : ""}
                              </span>
                            )}
                            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => toggleWishlist(product.id, e)}
                                className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${
                                  wishlist.has(product.id) ? "text-red-500" : "text-gray-600 hover:text-red-500"
                                }`}
                                aria-label={`Toggle wishlist for ${product.name}`}
                              >
                                <Heart size={16} fill={wishlist.has(product.id) ? "currentColor" : "none"} />
                              </button>
                              {canTryOn(product) && (
                                <button
                                  onClick={(e) => handleTryOn(product, e)}
                                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-purple-600 hover:text-purple-700 transition-colors"
                                  aria-label={`Try on ${product.name}`}
                                >
                                  <Sparkles size={16} />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleQuickView(product, e)}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-600 hover:text-gray-700 transition-colors"
                                aria-label={`Quick view ${product.name}`}
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">${discountedPrice}</span>
                                {(product.originalPrice || discountedPrice < product.price) && (
                                  <span className="text-sm text-gray-500 line-through">${product.price}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <ShoppingBag size={16} />
                              <span>Add to Cart</span>
                            </button>
                            {canTryOn(product) && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Sparkles size={12} className="mr-1" />
                                  Virtual Try-On
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div className="space-y-4" initial="hidden" animate="visible" variants={gridVariants}>
                    {paginatedProducts.map((product) => {
                      const { discountedPrice, appliedDiscount } = calculateDiscountedPrice(product.price, state.discounts);
                      return (
                        <motion.div
                          key={product.id}
                          variants={cardVariants}
                          className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex items-center p-6"
                          onClick={() => openProductDetail(product)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && openProductDetail(product)}
                        >
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <LazyImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            {(product.originalPrice || appliedDiscount) && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                {appliedDiscount
                                  ? `${appliedDiscount.discount_percentage}% OFF`
                                  : product.originalPrice
                                  ? `${Math.round(
                                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                                    )}% OFF`
                                  : ""}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 pl-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">${discountedPrice}</span>
                                {(product.originalPrice || discountedPrice < product.price) && (
                                  <span className="text-sm text-gray-500 line-through">${product.price}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star size={16} className="text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            {canTryOn(product) && (
                              <div className="mb-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Sparkles size={12} className="mr-1" />
                                  Virtual Try-On Available
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => toggleWishlist(product.id, e)}
                              className={`p-2 rounded-full transition-colors ${
                                wishlist.has(product.id) 
                                  ? "bg-red-50 text-red-500" 
                                  : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                              }`}
                              aria-label={`Toggle wishlist for ${product.name}`}
                            >
                              <Heart size={16} fill={wishlist.has(product.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <ShoppingBag size={16} />
                            </button>
                            {canTryOn(product) && (
                              <button
                                onClick={(e) => handleTryOn(product, e)}
                                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                                aria-label={`Try on ${product.name}`}
                              >
                                <Sparkles size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleQuickView(product, e)}
                              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              aria-label={`Quick view ${product.name}`}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-label={`Go to page ${pageNumber}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recently Viewed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.map((product) => {
                    const { discountedPrice, appliedDiscount } = calculateDiscountedPrice(product.price, state.discounts);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer overflow-hidden"
                        onClick={() => openProductDetail(product)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && openProductDetail(product)}
                      >
                        <div className="relative">
                          <LazyImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                          />
                          {(product.originalPrice || appliedDiscount) && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {appliedDiscount
                                ? `${appliedDiscount.discount_percentage}% OFF`
                                : product.originalPrice
                                ? `${Math.round(
                                    ((product.originalPrice - product.price) / product.originalPrice) * 100,
                                  )}% OFF`
                                : ""}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">${discountedPrice}</span>
                            {(product.originalPrice || discountedPrice < product.price) && (
                              <span className="text-sm text-gray-500 line-through">${product.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Virtual Try-On Modal - Only render when both conditions are met */}
            {selectedProduct && isTryOnOpen && (
              <Suspense
                fallback={
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="text-white text-lg">Loading Virtual Try-On...</div>
                  </div>
                }
              >
                <ErrorBoundary>
                  <VirtualTryOn
                    product={selectedProduct}
                    selectedColor={selectedProduct.colors[0]?.value}
                    onClose={closeTryOnModal}
                  />
                </ErrorBoundary>
              </Suspense>
            )}

            {/* Quick View Modal */}
            {quickViewProduct && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setQuickViewProduct(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                    aria-label="Close quick view"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <LazyImage
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      className="w-full sm:w-1/2 h-64 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{quickViewProduct.name}</h3>
                      <p className="text-gray-600 mb-4">{quickViewProduct.description}</p>
                      <div className="flex items-center space-x-2 mb-6">
                        <span className="text-2xl font-bold text-gray-900">
                          ${calculateDiscountedPrice(quickViewProduct.price, state.discounts).discountedPrice}
                        </span>
                        {(quickViewProduct.originalPrice ||
                          calculateDiscountedPrice(quickViewProduct.price, state.discounts).discountedPrice <
                            quickViewProduct.price) && (
                          <span className="text-lg text-gray-500 line-through">${quickViewProduct.price}</span>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => handleAddToCart(quickViewProduct, e)}
                          className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                          aria-label={`Add ${quickViewProduct.name} to cart`}
                        >
                          Add to Cart
                        </button>
                        {canTryOn(quickViewProduct) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(null);
                              handleTryOn(quickViewProduct, e);
                            }}
                            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                            aria-label={`Try on ${quickViewProduct.name}`}
                          >
                            <Sparkles size={16} />
                            <span>Try On</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;