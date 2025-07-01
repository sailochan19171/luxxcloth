

import type React from "react"
import { useState } from "react"
import { Sparkles } from "lucide-react"
import VirtualTryOn from "../components/VirtualTryOn"
import type { Product } from "../types"

interface VirtualTryOnButtonProps {
  product: Product
  selectedColor: string
  className?: string
  variant?: "overlay" | "inline" | "card"
}

const VirtualTryOnButton: React.FC<VirtualTryOnButtonProps> = ({
  product,
  selectedColor,
  className = "",
  variant = "inline",
}) => {
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false)

  // Check if product is suitable for virtual try-on
  const isTryOnCompatible = () => {
    const compatibleCategories = ["Outerwear", "Dresses", "Blazers", "Knitwear", "Shirts", "Sleepwear"]
    return product.canTryOn || compatibleCategories.includes(product.category)
  }

  if (!isTryOnCompatible()) {
    return null
  }

  const baseClasses = "flex items-center space-x-2 font-medium transition-all transform hover:scale-105"

  const variantClasses = {
    overlay:
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 shadow-lg",
    inline:
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 text-sm",
    card: "bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full hover:bg-white border border-purple-200 text-sm",
  }

  return (
    <>
      <button
        onClick={() => setShowVirtualTryOn(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        aria-label={`Try on ${product.name} virtually`}
      >
        <Sparkles size={18} />
        <span>Virtual Try-On</span>
      </button>

      {showVirtualTryOn && (
        <VirtualTryOn product={product} selectedColor={selectedColor} onClose={() => setShowVirtualTryOn(false)} />
      )}
    </>
  )
}

export default VirtualTryOnButton
