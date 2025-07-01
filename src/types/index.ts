// Core Product Types
export interface Color {
  name: string
  value: string
  image?: string
}

export interface Size {
  name: string
  value: string
  inStock: boolean
  sku: string
}

export interface ThreeDModel {
  url: string
  format: string
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  animations: Array<{
    name: string
    duration: number
    loop: boolean
  }>
  material: {
    type: string
    textureMap: string
    normalMap: string
    roughness: number
    metalness: number
  }
  cameraSettings: {
    position: { x: number; y: number; z: number }
    fov: number
  }
}

export interface Theme {
  name?: string
  colors?: {
    primary: string
    secondary: string
    accent: string
    background?: string
    surface?: string
    text?: string
  }
  primary?: string
  secondary?: string
  accent?: string
  backgroundColor: string
  texture: string
  lighting: string
  environment: string
  ambientEffects: string[]
  background?: string
  surface?: string
  text?: string
}

// Enhanced Virtual Try-On Configuration
export interface VirtualTryOnConfig {
  enabled: boolean
  type: "clothing" | "accessory" | "jewelry"
  bodyPoints: string[]
  fittingGuide: {
    measurements: {
      [key: string]: {
        min: number
        max: number
        unit: string
      }
    }
    sizeChart: {
      [size: string]: {
        [measurement: string]: number
      }
    }
    instructions?: string
  }
  arModel: {
    meshUrl: string
    textureVariants: {
      [colorValue: string]: string
    }
    animations: string[]
    physics: {
      fabric: string
      drape: string
      movement: string
    }
  }
  cameraSettings: {
    distance: number | string
    angle: string
    lighting: string
    background: string
  }
  // Hugging Face API specific settings
  huggingFace?: {
    modelId: string
    apiEndpoint?: string
    processingOptions?: {
      quality: "low" | "medium" | "high"
      speed: "fast" | "balanced" | "quality"
    }
  }
}

// Main Product Interface
export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  colorImages: { [colorValue: string]: string[] }
  threeDModel?: ThreeDModel
  virtualTryOn?: VirtualTryOnConfig
  theme: Theme
  category: string
  rating: number
  reviews: number
  colors: Color[]
  sizes?: Size[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  canTryOn?: boolean
  tags?: string[]
  features: string[]
  materials: string[]
  careInstructions: string[]
  warranty: string
  returnPeriod: string
}

// Delivery and Shopping
export interface DeliveryPartner {
  id: string
  name: string
  logo: string
  estimatedDays: string
  price: number
  features: string[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedColor: Color
  selectedSize?: Size
}

// Lookbook and Content
export interface LookbookItem {
  id: string
  images: string[]
  title: string
  subtitle: string
  description: string
  longDescription?: string
  season?: string
  mood?: string
  inspiration?: string
  stylingTips?: string[]
  productIds: string[]
  tags: string[]
  featured?: boolean
  category?: string
}

// User and Reviews
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

// Chat and Communication
export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

// Virtual Try-On API Types
export interface VirtualTryOnRequest {
  personImage: string | File
  clothingImage: string | File
  productId?: string
  colorVariant?: string
  settings?: {
    quality?: "low" | "medium" | "high"
    background?: "original" | "transparent" | "studio"
  }
}

export interface VirtualTryOnResponse {
  success: boolean
  resultImage?: string
  error?: string
  processingTime?: number
  metadata?: {
    modelUsed: string
    quality: string
    timestamp: string
  }
}

// Filter and Search Types
export interface FilterState {
  category: string
  priceRange: [number, number]
  colors: string[]
  sizes: string[]
  tags: string[]
  inStockOnly: boolean
  canTryOn?: boolean
  rating?: number
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  inStock?: boolean
  sortBy?: "price" | "rating" | "popularity" | "newest"
  sortOrder?: "asc" | "desc"
}

// Referral and Discount Types (from your existing system)
export interface ReferralDiscount {
  id: string
  user_id: string
  discount_percentage: number
  type: "referrer" | "referred"
  is_active: boolean
  expires_at?: string
  used?: boolean
  applied_at?: string
  referred_by: string
  created_at?: string
}

export interface ReferralState {
  discounts: ReferralDiscount[]
  totalSavings: number
  referralCode?: string
  currentUser?: {
    id: string
    referralCode: string
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Component Props Types
export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onTryOn?: (product: Product) => void
  showQuickView?: boolean
  className?: string
}

export interface VirtualTryOnProps {
  product: Product
  selectedColor: string
  onClose: () => void
  isOpen?: boolean
}

// Utility Types
export type ProductCategory =
  | "Outerwear"
  | "Dresses"
  | "Blazers"
  | "Knitwear"
  | "Shirts"
  | "Jeans"
  | "Footwear"
  | "Accessories"
  | "Sleepwear"

export type VirtualTryOnType = "clothing" | "accessory" | "jewelry"

export type SortOption = "rating" | "price-low" | "price-high" | "popular" | "newest" | "discount" | "name"

// Constants
export const VIRTUAL_TRYON_COMPATIBLE_CATEGORIES: ProductCategory[] = [
  "Outerwear",
  "Dresses",
  "Blazers",
  "Knitwear",
  "Shirts",
]

export const HUGGING_FACE_MODELS = {
  KOLORS_VIRTUAL_TRYON: "Kwai-Kolors/Kolors-Virtual-Try-On",
  OUTFIT_ANYONE: "levihsu/OOTDiffusion",
  FASHION_TRYON: "yisol/IDM-VTON",
} as const

// Type Guards
export const isVirtualTryOnCompatible = (product: Product): boolean => {
  return (
    product.canTryOn === true ||
    product.virtualTryOn?.enabled === true ||
    VIRTUAL_TRYON_COMPATIBLE_CATEGORIES.includes(product.category as ProductCategory)
  )
}

export const hasVirtualTryOnConfig = (product: Product): product is Product & { virtualTryOn: VirtualTryOnConfig } => {
  return product.virtualTryOn !== undefined && product.virtualTryOn.enabled === true
}
