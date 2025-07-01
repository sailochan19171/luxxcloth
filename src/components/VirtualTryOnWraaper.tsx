import type React from "react"
import VirtualTryOn from "./VirtualTryOn"
import type { Product } from "../types"

interface VirtualTryOnWrapperProps {
  product?: Product | null
  selectedColor?: string
  onClose: () => void
  isOpen: boolean
}

const VirtualTryOnWrapper: React.FC<VirtualTryOnWrapperProps> = ({ product, selectedColor, onClose, isOpen }) => {
  // Don't render anything if not open
  if (!isOpen) {
    return null
  }

  // Don't render if product is invalid
  if (!product || !selectedColor) {
    console.warn("VirtualTryOnWrapper: Invalid props", { product, selectedColor })
    return null
  }

  return <VirtualTryOn product={product} selectedColor={selectedColor} onClose={onClose} />
}

export default VirtualTryOnWrapper
