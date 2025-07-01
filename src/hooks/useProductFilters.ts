import { useState, useMemo, useEffect } from 'react';
import type { Product, FilterState } from '../types';

const useProductFilters = (allProducts: Product[]) => {
  const { minPrice, maxPrice, categories, colors, sizes, tags } = useMemo(() => {
    const prices = allProducts.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    const unique = <T,>(arr: T[]) => [...new Set(arr)];

    return {
      minPrice: min,
      maxPrice: max,
      categories: unique(['All', ...allProducts.map((p) => p.category)]),
      colors: unique(allProducts.flatMap((p) => p.colors)),
      sizes: unique(allProducts.flatMap((p) => p.availableSizes)),
      tags: unique(allProducts.flatMap((p) => p.tags)),
    };
  }, [allProducts]);

  const getInitialFilterState = (): FilterState => {
    const savedFilters = localStorage.getItem('productFilters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        if (!parsed.priceRange || parsed.priceRange.length !== 2) {
          parsed.priceRange = [minPrice, maxPrice];
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse filters from localStorage", e);
      }
    }
    return {
      category: 'All',
      priceRange: [minPrice, maxPrice],
      colors: [],
      sizes: [],
      tags: [],
      inStockOnly: false,
    };
  };

  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<FilterState>(getInitialFilterState);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('productFilters', JSON.stringify(filterState));
  }, [filterState]);

  const resetFilters = () => {
    setFilterState({
      category: 'All',
      priceRange: [minPrice, maxPrice],
      colors: [],
      sizes: [],
      tags: [],
      inStockOnly: false,
    });
    setSearchQuery('');
    setSortBy('rating');
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.category !== 'All') count++;
    if (filterState.priceRange[0] !== minPrice || filterState.priceRange[1] !== maxPrice) count++;
    if (filterState.colors.length > 0) count++;
    if (filterState.sizes.length > 0) count++;
    if (filterState.tags.length > 0) count++;
    if (filterState.inStockOnly) count++;
    return count;
  }, [filterState, minPrice, maxPrice]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterState.category !== 'All') {
      products = products.filter((p) => p.category === filterState.category);
    }

    // Filter by price
    products = products.filter(
      (p) => p.price >= filterState.priceRange[0] && p.price <= filterState.priceRange[1]
    );

    // Filter by colors
    if (filterState.colors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((c) => filterState.colors.includes(c))
      );
    }

    // Filter by sizes
    if (filterState.sizes.length > 0) {
      products = products.filter((p) =>
        p.availableSizes.some((s) => filterState.sizes.includes(s))
      );
    }

    // Filter by tags
    if (filterState.tags.length > 0) {
      products = products.filter((p) =>
        p.tags.some((t) => filterState.tags.includes(t))
      );
    }

    // Filter by stock
    if (filterState.inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'quality':
        products.sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0));
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        products.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      case 'discount':
        products.sort((a, b) => {
          const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discountB - discountA;
        });
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [allProducts, searchQuery, filterState, sortBy]);

  return {
    // State
    sortBy,
    searchQuery,
    filterState,
    currentPage,
    // Setters
    setSortBy,
    setSearchQuery,
    setFilterState,
    setCurrentPage,
    // Derived values
    filteredProducts,
    activeFiltersCount,
    // Filter options
    minPrice,
    maxPrice,
    categories,
    colors,
    sizes,
    tags,
    // Actions
    resetFilters,
  };
};

export default useProductFilters;
