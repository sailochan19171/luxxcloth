import React from "react";
import { motion, type Variants } from "framer-motion";
import { Star, Heart, Eye, Sparkles, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import type { ReferralDiscount } from "../../context/ReferralContext";
import LazyImage from "../LazyImage";

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onQuickView: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onTryOn: (product: Product, e: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  isWishlisted: boolean;
  canTryOn: boolean;
  discountedPrice: number;
  appliedDiscount: ReferralDiscount | null;
}

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onTryOn,
  onProductClick,
  isWishlisted,
  canTryOn,
  discountedPrice,
  appliedDiscount,
}) => {
  return (
    <motion.div
      variants={listItemVariants}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col sm:flex-row"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onProductClick(product)}
    >
      <div className="relative sm:w-1/3 overflow-hidden">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-64 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors pr-4">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star size={16} className="text-yellow-400" />
              <span className="text-base font-medium text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-base text-gray-500 mb-4">{product.category}</p>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">${discountedPrice.toFixed(2)}</p>
            {(product.originalPrice || appliedDiscount) && (
              <p className="text-base text-gray-500 line-through">
                ${(appliedDiscount ? product.price : product.originalPrice)?.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => onToggleWishlist(product.id, e)}
              className={`p-3 rounded-full bg-gray-100 transition-colors ${
                isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
              aria-label={`Toggle wishlist for ${product.name}`}
            >
              <Heart size={20} />
            </button>
            <button
              onClick={(e) => onQuickView(product, e)}
              className="p-3 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye size={20} />
            </button>
            {canTryOn && (
              <button
                onClick={(e) => onTryOn(product, e)}
                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:text-purple-600 transition-colors"
                aria-label={`Virtual try on ${product.name}`}
              >
                <Sparkles size={20} />
              </button>
            )}
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;
