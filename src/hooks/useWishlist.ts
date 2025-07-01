import { useState, useEffect, useCallback } from 'react';

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? new Set(JSON.parse(savedWishlist)) : new Set();
    } catch (error) {
      console.error('Error reading wishlist from localStorage', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist)));
    } catch (error) {
      console.error('Error saving wishlist to localStorage', error);
    }
  }, [wishlist]);

  const onToggleWishlist = useCallback((productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prevWishlist) => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  }, []);

  return { wishlist, onToggleWishlist };
};

export default useWishlist;
