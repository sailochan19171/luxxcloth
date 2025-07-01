import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown } from "lucide-react";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "quality", label: "Best Quality" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "discount", label: "Biggest Discount" },
  { value: "name", label: "Name (A-Z)" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, setSortBy }) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
  );
};

export default SortDropdown;
