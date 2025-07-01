

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { useReferral } from "../context/ReferralContext"

// Sample product data - replace with your actual data source
const sampleProducts = [
  {
    id: "1",
    name: "Italian Leather Handbag",
    description: "Handcrafted Italian leather handbag with gold hardware and sophisticated design",
    price: 599,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    category: "bags",
    inStock: true,
  },
  {
    id: "2",
    name: "Luxury Watch Collection",
    description: "Swiss-made luxury timepiece with automatic movement and sapphire crystal",
    price: 1299,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    category: "watches",
    inStock: true,
  },
  {
    id: "3",
    name: "Cashmere Blend Luxury Coat",
    description: "Exquisite cashmere blend coat with premium wool lining, perfect for elegant occasions",
    price: 899,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    category: "clothing",
    inStock: true,
  },
  {
    id: "4",
    name: "Premium Silk Scarf",
    description: "Luxurious hand-painted silk scarf with intricate patterns, perfect for any occasion",
    price: 89,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    category: "accessories",
    inStock: true,
  },
  {
    id: "5",
    name: "Designer Sunglasses",
    description: "Premium designer sunglasses with UV protection and titanium frame",
    price: 299,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    category: "accessories",
    inStock: true,
  },
  {
    id: "6",
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection and multiple card slots",
    price: 129,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    category: "accessories",
    inStock: true,
  },
]

export default function ProductGrid() {
  const { state } = useReferral()
  const [products] = useState(sampleProducts)

  useEffect(() => {
    // Log discount status for debugging
    if (state.currentUser && state.discounts.length > 0) {
      console.log(
        "🎫 User has discounts:",
        state.discounts.map((d) => ({
          id: d.id,
          percentage: d.discount_percentage,
          active: d.is_active,
          expires: d.expires_at,
        })),
      )
    }
  }, [state.discounts, state.currentUser])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-2">
            Showing {products.length} of {products.length} products
          </p>
        </div>

        {/* Discount Status */}
        {state.currentUser && state.discounts.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium">
                🎉 You have {state.discounts.filter((d) => d.is_active).length} active discount(s)!
              </span>
            </div>
            {state.discounts
              .filter((d) => d.is_active)
              .map((discount) => (
                <div key={discount.id} className="text-sm text-green-700 mt-1">
                  {discount.discount_percentage}% off all items (expires{" "}
                  {discount.expires_at ? discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : "N/A" : "N/A"})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={(product) => console.log('Add to cart:', product)}
            onQuickView={(product) => console.log('Quick view:', product)}
          />
        ))}
      </div>

      {/* No discounts message */}
      {state.currentUser && state.discounts.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Want to save on your purchases?</h3>
            <p className="text-blue-700 mb-4">Share your referral link with friends to earn discounts!</p>
            <div className="text-sm text-blue-600">
              Your referral code: <span className="font-mono font-bold">{state.currentUser?.referralCode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
