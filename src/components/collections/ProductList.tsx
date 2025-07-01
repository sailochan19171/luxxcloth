import React from "react";
import { motion } from "framer-motion";
import type { Product } from "../../types";
import type { ReferralDiscount } from "../../context/ReferralContext";
import ProductListItem from "./ProductListItem";

interface ProductListProps {
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

const ProductList: React.FC<ProductListProps> = ({
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
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{}}
    >
      {products.map((product) => {
        const { discountedPrice, appliedDiscount } = calculateDiscountedPrice(product.price, discounts);
        return (
          <ProductListItem
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

export default ProductList;
