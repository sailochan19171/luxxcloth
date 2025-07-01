import React from "react";
import { motion, type Variants } from "framer-motion";
import { Star, Heart, Eye, Sparkles, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import type { ReferralDiscount } from "../../context/ReferralContext";
import LazyImage from "../LazyImage";

interface ProductCardProps {
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

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const ProductCard: React.FC<ProductCardProps> = ({
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
      variants={cardVariants}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onProductClick(product)}
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
            onClick={(e) => onToggleWishlist(product.id, e)}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            aria-label={`Toggle wishlist for ${product.name}`}
          >
            <Heart size={18} />
          </button>
          <button
            onClick={(e) => onQuickView(product, e)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-600 hover:text-blue-600 transition-colors"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={18} />
          </button>
          {canTryOn && (
            <button
              onClick={(e) => onTryOn(product, e)}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-600 hover:text-purple-600 transition-colors"
              aria-label={`Virtual try on ${product.name}`}
            >
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors pr-2">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline space-x-2">
            <p className="text-lg font-bold text-gray-900">${discountedPrice.toFixed(2)}</p>
            {(product.originalPrice || appliedDiscount) && (
              <p className="text-sm text-gray-500 line-through">
                ${(appliedDiscount ? product.price : product.originalPrice)?.toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={(e) => onAddToCart(product, e)}
            className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform group-hover:scale-110"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
