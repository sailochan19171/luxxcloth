import React from "react";
import { motion, type Variants } from "framer-motion";
import type { Product } from "../../types";
import type { ReferralDiscount } from "../../context/ReferralContext";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onQuickView: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onTryOn: (product: Product, e: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  wishlist: Set<string>;
  canTryOn: (product: Product) => boolean;
  calculateDiscountedPrice: (price: number, discounts: ReferralDiscount[]) => { discountedPrice: number; appliedDiscount: ReferralDiscount | null; };
  discounts: ReferralDiscount[];
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onTryOn,
  onProductClick,
  wishlist,
  canTryOn,
  calculateDiscountedPrice,
  discounts,
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={gridVariants}
    >
      {products.map((product) => {
        const { discountedPrice, appliedDiscount } = calculateDiscountedPrice(product.price, discounts);
        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            onToggleWishlist={onToggleWishlist}
            onTryOn={onTryOn}
            onProductClick={onProductClick}
            isWishlisted={wishlist.has(product.id)}
            canTryOn={canTryOn(product)}
            discountedPrice={discountedPrice}
            appliedDiscount={appliedDiscount}
          />
        );
      })}
    </motion.div>
  );
};

export default ProductGrid;
