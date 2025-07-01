import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import type { FilterState } from "../../types";
import { products } from "../../data/products";

interface ProductFiltersProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  colors: string[];
  sizes: string[];
  resetFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  showFilters,
  setShowFilters,
  filterState,
  setFilterState,
  minPrice,
  maxPrice,
  categories,
  colors,
  sizes,
}) => {
  const filtersRef = useRef<HTMLDivElement>(null);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['category', 'price']));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowFilters]);

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

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          ref={filtersRef}
          className="fixed inset-0 lg:relative lg:inset-auto z-50 lg:w-80 bg-white lg:bg-transparent"
          variants={{
            hidden: { x: "-100%", opacity: 0 },
            visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
            exit: { x: "-100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
          }}
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
                            width: `${((filterState.priceRange[1] - filterState.priceRange[0]) / (maxPrice - minPrice)) * 100}%`,
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
  );
};

export default ProductFilters;
