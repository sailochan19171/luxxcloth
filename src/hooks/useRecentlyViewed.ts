import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';

const MAX_RECENTLY_VIEWED = 5;

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('recentlyViewed');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading recently viewed from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving recently viewed to localStorage', error);
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev; // Don't add if it's already there
      const updated = [product, ...prev];
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed };
};

export default useRecentlyViewed;
