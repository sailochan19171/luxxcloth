import React from "react";
import { Filter, RefreshCw, Search } from "lucide-react";
import SortDropdown from "./SortDropdown";

interface ToolbarProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  activeFiltersCount: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredProductCount: number;
  totalProductCount: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  showFilters,
  setShowFilters,
  activeFiltersCount,
  sortBy,
  setSortBy,
  resetFilters,
  searchQuery,
  setSearchQuery,
  filteredProductCount,
  totalProductCount,
}) => {
  return (
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

        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

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
          <span className="font-semibold text-gray-900">{filteredProductCount}</span> of{" "}
          <span className="font-semibold">{totalProductCount}</span> products
        </p>
        
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
  );
};

export default Toolbar;
