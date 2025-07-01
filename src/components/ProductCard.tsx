

import React from "react"
import { Heart, Star, Eye } from 'lucide-react'
import { useDiscountCalculation } from "../components/useDiscountCalculations"
import { useReferral } from "../context/ReferralContext"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  category: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onQuickView: (product: Product) => void
  onToggleWishlist?: (productId: string) => void
  isWishlisted?: boolean
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const { state } = useReferral()
  const discountCalc = useDiscountCalculation(product.price)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleWishlist) {
      onToggleWishlist(product.id)
    }
  }

  return (
    <div className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 relative overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {discountCalc.hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
            {discountCalc.discountPercentage}% OFF
          </span>
        )}

        {/* Referral Discount Badge */}
        {state.currentUser && discountCalc.hasDiscount && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
            Referral Discount!
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleWishlist && (
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors ${
                isWishlisted ? 'text-red-500' : ''
              }`}
              aria-label={`Toggle wishlist for ${product.name}`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          )}
          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              ${discountCalc.discountedPrice}
            </span>
            {discountCalc.hasDiscount && (
              <span className="text-sm text-gray-500 line-through">${discountCalc.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Savings Display */}
        {discountCalc.hasDiscount && (
          <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              You save ${discountCalc.savings}!
            </p>
            {state.currentUser && (
              <p className="text-xs text-green-600">Thanks to your referral discount</p>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
