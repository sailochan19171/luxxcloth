

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingBag,
  ArrowLeft,
  Eye,
  Palette,
  Sparkles,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Plus,
  Minus,
  ZoomIn,
  X,
  ShoppingCart,
  Tag,
} from "lucide-react";

// Type Definitions
interface Lookbook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  season: string;
  mood: string;
  inspiration: string;
  images: string[];
  productIds: string[];
  featured: boolean;
  stylingTips: string[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  isSale?: boolean;
  isNew?: boolean;
  colors: { name: string; value: string }[];
  sizes?: { name: string; inStock: boolean }[];
  features: string[];
}

interface CartItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface SelectionModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (color: string, size?: string) => void;
}

// Sample Lookbook Data
const lookbookItems: Lookbook[] = [
  {
    id: "1",
    title: "Urban Elegance",
    subtitle: "Modern sophistication meets street style",
    description: "A curated collection blending urban aesthetics with timeless elegance.",
    longDescription:
      "This collection represents the perfect fusion of urban sophistication and timeless elegance. Each piece is carefully selected to create versatile looks that transition seamlessly from day to night.",
    season: "Fall 2024",
    mood: "Sophisticated",
    inspiration: "Inspired by metropolitan life and modern architecture.",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    ],
    productIds: ["1", "2", "3", "4"],
    featured: true,
    stylingTips: [
      "Layer the cashmere coat over the silk dress for a chic evening look.",
      "Pair the blazer with jeans for a work-to-weekend transition.",
      "Add the leather handbag as a statement piece.",
      "Mix textures with wool and velvet accessories.",
    ],
  },
  {
    id: "2",
    title: "Casual Luxe",
    subtitle: "Effortless comfort with premium materials",
    description: "Relaxed silhouettes crafted from the finest materials for comfort and style.",
    longDescription:
      "Our Casual Luxe collection redefines everyday wear with premium materials and thoughtful design, offering unparalleled comfort.",
    season: "Spring 2024",
    mood: "Relaxed",
    inspiration: "Inspired by leisurely weekend mornings and luxury loungewear.",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    ],
    productIds: ["5", "6", "7", "8"],
    featured: false,
    stylingTips: [
      "Layer the turtleneck under the linen shirt for transitional weather.",
      "Style jeans with suede loafers for a polished casual look.",
      "Add a silk scarf for a pop of color.",
      "Mix casual and formal elements for everyday elegance.",
    ],
  },
  {
    id: "3",
    title: "Evening Glamour",
    subtitle: "Sophisticated pieces for special occasions",
    description: "Luxurious evening wear with rich textures and elegant silhouettes.",
    longDescription:
      "Our Evening Glamour collection features curated pieces that embody sophistication, perfect for galas and celebrations.",
    season: "Holiday 2024",
    mood: "Glamorous",
    inspiration: "Inspired by Hollywood glamour and red carpet elegance.",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    ],
    productIds: ["9", "10", "11", "12"],
    featured: true,
    stylingTips: [
      "Pair the silk dress with a luxury watch for elegance.",
      "Layer a silk scarf over the velvet suit for texture.",
      "Choose statement accessories for evening wear.",
      "Keep other elements minimal with a standout piece.",
    ],
  },
];

// Sample Product Data
const products: Product[] = [
  {
    id: "1",
    name: "Cashmere Coat",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
    price: 299.99,
    originalPrice: 349.99,
    description: "Luxurious cashmere coat for timeless elegance.",
    rating: 4.5,
    reviews: 120,
    category: "Outerwear",
    isSale: true,
    isNew: false,
    colors: [
      { name: "Beige", value: "#F5E8C7" },
      { name: "Charcoal", value: "#333333" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: false },
    ],
    features: ["100% Cashmere", "Dry Clean Only", "Double-Breasted"],
  },
  {
    id: "2",
    name: "Silk Dress",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
    price: 199.99,
    description: "Elegant silk dress for evening wear.",
    rating: 4.8,
    reviews: 85,
    category: "Dresses",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Emerald", value: "#2E8B57" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: false },
    ],
    features: ["Pure Silk", "Hand Wash", "A-Line Silhouette"],
  },
  {
    id: "3",
    name: "Tailored Blazer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    price: 149.99,
    description: "Sharp tailored blazer for professional looks.",
    rating: 4.3,
    reviews: 60,
    category: "Blazers",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Navy", value: "#1C2526" },
      { name: "Grey", value: "#808080" },
    ],
    sizes: [
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: false },
    ],
    features: ["Wool Blend", "Single-Breasted", "Notch Lapel"],
  },
  {
    id: "4",
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    price: 89.99,
    description: "Premium Italian leather handbag.",
    rating: 4.7,
    reviews: 95,
    category: "Accessories",
    isSale: true,
    isNew: false,
    colors: [
      { name: "Brown", value: "#8B4513" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [],
    features: ["Genuine Leather", "Magnetic Closure", "Adjustable Strap"],
  },
  {
    id: "5",
    name: "Merino Turtleneck",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    price: 79.99,
    description: "Soft merino wool turtleneck for layering.",
    rating: 4.4,
    reviews: 50,
    category: "Sweaters",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Cream", value: "#FFFDD0" },
      { name: "Olive", value: "#6B8E23" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: false },
      { name: "L", inStock: true },
    ],
    features: ["100% Merino Wool", "Machine Washable", "Slim Fit"],
  },
  {
    id: "6",
    name: "Linen Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    price: 69.99,
    description: "Breathable linen shirt for casual elegance.",
    rating: 4.2,
    reviews: 45,
    category: "Shirts",
    isSale: false,
    isNew: true,
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Blue", value: "#4682B4" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
    ],
    features: ["100% Linen", "Button-Down", "Relaxed Fit"],
  },
  {
    id: "7",
    name: "High-Waist Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    price: 99.99,
    description: "Flattering high-waist jeans for all-day comfort.",
    rating: 4.6,
    reviews: 70,
    category: "Jeans",
    isSale: true,
    isNew: false,
    colors: [
      { name: "Dark Wash", value: "#2F4F4F" },
      { name: "Light Wash", value: "#ADD8E6" },
    ],
    sizes: [
      { name: "XS", inStock: true },
      { name: "S", inStock: false },
      { name: "M", inStock: true },
    ],
    features: ["Cotton Blend", "High-Waist", "Slim Fit"],
  },
  {
    id: "8",
    name: "Silk Scarf",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    price: 49.99,
    description: "Luxurious silk scarf for a pop of color.",
    rating: 4.9,
    reviews: 30,
    category: "Accessories",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Red", value: "#FF0000" },
      { name: "Navy", value: "#000080" },
    ],
    sizes: [],
    features: ["Pure Silk", "Hand Wash", "Versatile Styling"],
  },
  {
    id: "9",
    name: "Velvet Suit",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    price: 249.99,
    description: "Luxurious velvet suit for evening elegance.",
    rating: 4.7,
    reviews: 55,
    category: "Suits",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Burgundy", value: "#800020" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: false },
    ],
    features: ["100% Velvet", "Dry Clean Only", "Tailored Fit"],
  },
  {
    id: "10",
    name: "Luxury Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    price: 399.99,
    description: "Timeless luxury watch for any occasion.",
    rating: 4.8,
    reviews: 40,
    category: "Accessories",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Silver", value: "#C0C0C0" },
      { name: "Gold", value: "#FFD700" },
    ],
    sizes: [],
    features: ["Stainless Steel", "Water Resistant", "Analog Display"],
  },
  {
    id: "11",
    name: "Suede Loafers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    price: 129.99,
    description: "Elegant suede loafers for a polished look.",
    rating: 4.5,
    reviews: 65,
    category: "Shoes",
    isSale: true,
    isNew: false,
    colors: [
      { name: "Tan", value: "#D2B48C" },
      { name: "Navy", value: "#000080" },
    ],
    sizes: [
      { name: "8", inStock: true },
      { name: "9", inStock: true },
      { name: "10", inStock: false },
    ],
    features: ["Genuine Suede", "Leather Lining", "Slip-On"],
  },
  {
    id: "12",
    name: "Wool Turtleneck",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    price: 89.99,
    description: "Cozy wool turtleneck for layering.",
    rating: 4.4,
    reviews: 50,
    category: "Sweaters",
    isSale: false,
    isNew: true,
    colors: [
      { name: "Grey", value: "#808080" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: false },
    ],
    features: ["100% Wool", "Dry Clean Only", "Fitted"],
  },
];

// Sample Review Data
const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    author: "Jane Doe",
    rating: 5,
    comment: "This cashmere coat is incredibly soft and stylish!",
    date: "2024-10-15",
  },
  {
    id: "r2",
    productId: "2",
    author: "Sarah Smith",
    rating: 4,
    comment: "Love the silk dress, but sizing runs small.",
    date: "2024-10-10",
  },
  {
    id: "r3",
    productId: "3",
    author: "Mike Johnson",
    rating: 4,
    comment: "Great blazer, perfect for work.",
    date: "2024-10-05",
  },
  {
    id: "r4",
    productId: "4",
    author: "Emily Brown",
    rating: 5,
    comment: "The leather handbag is a must-have!",
    date: "2024-09-30",
  },
];

// Internal Component: Size/Color Selection Modal
const SelectionModal: React.FC<SelectionModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.value || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.find((s) => s.inStock)?.name || "");

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-forest-50 rounded-xl p-6 max-w-sm w-full shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-serif font-bold text-forest-900">
            Select Options
          </h2>
          <button onClick={onClose} className="text-forest-600 hover:text-forest-900" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-forest-900 mb-1">Color</label>
          <div className="flex space-x-2">
            {product.colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`h-6 w-6 rounded-full border-2 ${
                  selectedColor === color.value ? "border-forest-600" : "border-forest-200"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-forest-900 mb-1">Size</label>
            <div className="flex space-x-2 flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => size.inStock && setSelectedSize(size.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    size.inStock
                      ? selectedSize === size.name
                        ? "bg-forest-600 text-forest-50"
                        : "bg-forest-100 text-forest-900 hover:bg-forest-200"
                      : "bg-forest-50 text-forest-400 cursor-not-allowed"
                  }`}
                  disabled={!size.inStock}
                  aria-label={`Select size ${size.name}`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(selectedColor, selectedSize)}
          className="w-full bg-forest-600 text-forest-50 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Internal Component: Customer Reviews
const CustomerReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const productReviews = reviews.filter((review) => review.productId === productId);
  if (!productReviews.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-forest-900 mb-2">Customer Reviews</h4>
      {productReviews.slice(0, 2).map((review) => (
        <div key={review.id} className="mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < review.rating ? "text-forest-400 fill-current" : "text-forest-300"}`}
                />
              ))}
            </div>
            <span className="text-xs text-forest-500">{review.date}</span>
          </div>
          <p className="text-xs text-forest-600 mt-1">{review.comment}</p>
          <p className="text-xs text-forest-700 font-medium mt-1">{review.author}</p>
        </div>
      ))}
    </div>
  );
};

// Internal Component: Cart Summary Modal
interface CartSummaryModalProps {
  cart: CartItem[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
}

const CartSummaryModal: React.FC<CartSummaryModalProps> = ({ cart, products, isOpen, onClose, onRemoveItem }) => {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-forest-50 rounded-xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="cart-modal-title" className="text-xl font-serif font-bold text-forest-900">
            Your Cart ({cart.length} items)
          </h2>
          <button onClick={onClose} className="text-forest-600 hover:text-forest-900" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>
        {cart.length === 0 ? (
          <p className="text-forest-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center space-x-4 border-b border-forest-100 pb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-forest-900">{product.name}</p>
                    <p className="text-xs text-forest-600">
                      {item.selectedColor} {item.selectedSize && `| ${item.selectedSize}`}
                    </p>
                    <p className="text-xs text-forest-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-forest-900">${(product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-forest-600 hover:text-forest-900"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4">
          <div className="flex justify-between text-sm font-medium text-forest-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-forest-600 text-forest-50 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 mt-4"
            onClick={() => alert("Proceed to checkout (placeholder)")}
          >
            Checkout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main ShopLookbook Component
const ShopLookbook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [currentLookbookIndex, setCurrentLookbookIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Get Lookbook Data
  const lookbook = useMemo(() => lookbookItems.find((item) => item.id === id), [id]);
  const lookbookProducts = useMemo(
    () => (lookbook ? products.filter((product) => lookbook.productIds.includes(product.id)) : []),
    [lookbook]
  );

  // Filtered Products
  const filteredProducts = useMemo(
    () =>
      filterCategory === "All"
        ? lookbookProducts
        : lookbookProducts.filter((product) => product.category === filterCategory),
    [lookbookProducts, filterCategory]
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: cubicBezier(0.43, 0.13, 0.23, 0.96) } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } },
  };

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (lookbook) {
      const index = lookbookItems.findIndex((item) => item.id === id);
      if (index === -1) {
        setError("Lookbook not found");
      } else {
        setCurrentLookbookIndex(index);
      }
    }
  }, [id, lookbook]);

  // Handlers
  const handleImageChange = useCallback(
    (direction: "next" | "prev" | number) => {
      if (!lookbook) return;
      if (typeof direction === "number") {
        setCurrentImageIndex(direction);
      } else {
        setCurrentImageIndex((prev) =>
          direction === "next"
            ? prev + 1 >= lookbook.images.length
              ? 0
              : prev + 1
            : prev - 1 < 0
              ? lookbook.images.length - 1
              : prev - 1
        );
      }
    },
    [lookbook]
  );

  const handleProductLike = useCallback((productId: string) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  }, []);

  const handleQuantityChange = useCallback((productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  }, []);

  const handleNavigateLookbook = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? (currentLookbookIndex + 1) % lookbookItems.length
          : (currentLookbookIndex - 1 + lookbookItems.length) % lookbookItems.length;
      navigate(`/shop-the-look/${lookbookItems[newIndex].id}`);
    },
    [currentLookbookIndex, navigate]
  );

  const handleShare = useCallback(async () => {
    if (navigator.share && lookbook) {
      try {
        await navigator.share({
          title: lookbook.title,
          text: lookbook.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [lookbook]);

  const handleAddToCart = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsSelectionModalOpen(true);
  }, []);

  const handleAddToCartConfirm = useCallback(
    (color: string, size?: string) => {
      if (!selectedProduct) return;
      setCart((prev) => [
        ...prev,
        {
          productId: selectedProduct.id,
          quantity: quantities[selectedProduct.id] || 1,
          selectedColor: color,
          selectedSize: size,
        },
      ]);
      setIsSelectionModalOpen(false);
      setSelectedProduct(null);
    },
    [selectedProduct, quantities]
  );

  const handleRemoveCartItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(lookbookProducts.map((p) => p.category))], [lookbookProducts]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-forest-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-forest-200 border-t-forest-600 mx-auto mb-3"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-forest-600 animate-pulse" />
            </div>
          </div>
          <p className="text-forest-600 text-sm font-medium">Loading lookbook...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error || !lookbook) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-forest-50 to-forest-100 py-12"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 mb-4">Discover Our Lookbooks</h1>
            <p className="text-lg text-forest-600 max-w-2xl mx-auto leading-relaxed">
              Explore curated fashion collections to elevate your style.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lookbookItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer bg-forest-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/shop-the-look/${item.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/shop-the-look/${item.id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-forest-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-serif font-bold">{item.title}</h3>
                    <p className="text-xs">{item.subtitle}</p>
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-forest-600 text-forest-50 px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-serif font-semibold text-forest-900">{item.title}</h3>
                    <span className="text-xs text-forest-500">{item.season}</span>
                  </div>
                  <p className="text-forest-600 text-xs line-clamp-2 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-forest-600">{item.productIds.length} pieces</span>
                    <ArrowRight className="h-4 w-4 text-forest-400 group-hover:text-forest-600 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-forest-900 text-forest-50 px-8 py-3 rounded-lg font-medium hover:bg-forest-600 transition-colors duration-300 flex items-center space-x-2 mx-auto mt-8"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-forest-50 to-forest-100"
    >
      {/* Navigation Header */}
      <motion.div
        variants={itemVariants}
        className="sticky top-0 z-50 bg-forest-50/95 backdrop-blur-sm border-b border-forest-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 text-forest-600 hover:text-forest-900 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="hidden sm:block h-5 w-px bg-forest-300"></div>
              <div className="hidden sm:flex items-center space-x-1 text-xs text-forest-500">
                <span>Lookbook</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-forest-900 font-medium">{lookbook.title}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="h-8 w-8 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors"
                aria-label="Share lookbook"
              >
                <Share2 className="h-4 w-4 text-forest-600" />
              </button>
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="h-8 w-8 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors relative"
                aria-label={`View cart with ${cart.length} items`}
              >
                <ShoppingCart className="h-4 w-4 text-forest-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-forest-600 text-forest-50 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleNavigateLookbook("prev")}
                  className="h-8 w-8 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors"
                  aria-label="Previous lookbook"
                >
                  <ChevronLeft className="h-4 w-4 text-forest-600" />
                </button>
                <button
                  onClick={() => handleNavigateLookbook("next")}
                  className="h-8 w-8 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors"
                  aria-label="Next lookbook"
                >
                  <ChevronRight className="h-4 w-4 text-forest-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section variants={itemVariants} className="relative py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative h-[60vh] min-h-[500px]"
              >
                <img
                  src={lookbook.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${lookbook.title} image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/10 to-transparent"></div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={() => handleImageChange("prev")}
                className="h-10 w-10 rounded-full bg-forest-50/20 backdrop-blur-sm hover:bg-forest-50/30 flex items-center justify-center transition-all group"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-forest-50 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleImageChange("next")}
                className="h-10 w-10 rounded-full bg-forest-50/20 backdrop-blur-sm hover:bg-forest-50/30 flex items-center justify-center transition-all group"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-forest-50 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {lookbook.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-forest-50 scale-125" : "bg-forest-50/50 hover:bg-forest-50/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-forest-50/20 backdrop-blur-sm hover:bg-forest-50/30 flex items-center justify-center transition-all"
              aria-label="Zoom image"
            >
              <ZoomIn className="h-4 w-4 text-forest-50" />
            </button>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-8 left-8 text-forest-50 max-w-xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-forest-600 text-forest-50 text-xs font-bold rounded-full">
                  {lookbook.season}
                </span>
                <span className="px-3 py-1 bg-forest-50/20 backdrop-blur-sm text-forest-50 text-xs font-medium rounded-full">
                  {lookbook.mood}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 leading-tight">{lookbook.title}</h1>
              <p className="text-lg md:text-xl mb-3 leading-relaxed">{lookbook.subtitle}</p>
              <p className="text-sm leading-relaxed opacity-90">{lookbook.description}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Lookbook Details */}
      <motion.section variants={itemVariants} className="py-12 bg-forest-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mb-4">The Story Behind</h2>
              <p className="text-base text-forest-600 mb-6 leading-relaxed">{lookbook.longDescription}</p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Palette className="h-4 w-4 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-900 mb-1">Inspiration</h3>
                    <p className="text-forest-600 text-xs">{lookbook.inspiration}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-900 mb-1">Season</h3>
                    <p className="text-forest-600 text-xs">{lookbook.season}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-900 mb-1">Mood</h3>
                    <p className="text-forest-600 text-xs">{lookbook.mood}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {lookbook.images.slice(0, 4).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className={`relative overflow-hidden rounded-lg ${index === 0 ? "col-span-2 h-48" : "h-32"}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${lookbook.title} detail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Styling Tips */}
      {lookbook.stylingTips && lookbook.stylingTips.length > 0 && (
        <motion.section variants={itemVariants} className="py-12 bg-forest-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mb-3">Styling Tips</h2>
              <p className="text-base text-forest-600 max-w-2xl mx-auto">Expert advice to master this look</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lookbook.stylingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-4 bg-forest-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-8 w-8 rounded-full bg-forest-600 text-forest-50 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-forest-700 text-sm leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Products Section */}
      <motion.section variants={itemVariants} className="py-12 bg-forest-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mb-3">Shop This Look</h2>
            <p className="text-base text-forest-600 max-w-2xl mx-auto">Curated pieces for a complete outfit</p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1 bg-forest-100 rounded-full p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    filterCategory === category
                      ? "bg-forest-600 text-forest-50"
                      : "text-forest-600 hover:bg-forest-200"
                  }`}
                  aria-label={`Filter by ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-forest-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  role="article"
                  aria-labelledby={`product-${product.id}-title`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <span className="bg-forest-50/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-forest-900">
                        {product.category}
                      </span>
                      {product.isSale && (
                        <span className="bg-red-500 text-forest-50 px-2 py-1 rounded-full text-xs font-bold">SALE</span>
                      )}
                      {product.isNew && (
                        <span className="bg-green-500 text-forest-50 px-2 py-1 rounded-full text-xs font-bold">NEW</span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col space-y-1">
                      <button
                        onClick={() => handleProductLike(product.id)}
                        className={`h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                          likedProducts.has(product.id)
                            ? "bg-red-500 text-forest-50"
                            : "bg-forest-50/20 text-forest-50 hover:bg-forest-50/30"
                        }`}
                        aria-label={likedProducts.has(product.id) ? "Unlike product" : "Like product"}
                      >
                        <Heart className={`h-4 w-4 ${likedProducts.has(product.id) ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="h-8 w-8 rounded-full bg-forest-50/20 backdrop-blur-sm text-forest-50 hover:bg-forest-50/30 flex items-center justify-center transition-all"
                        aria-label="View product details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-forest-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-forest-50 text-forest-900 px-6 py-2 rounded-lg text-xs font-medium shadow-md hover:bg-forest-600 hover:text-forest-50 transition-colors"
                        aria-label={`Quick add ${product.name} to cart`}
                      >
                        Quick Add
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        id={`product-${product.id}-title`}
                        className="text-lg font-serif font-semibold text-forest-900 group-hover:text-forest-600 transition-colors"
                      >
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-forest-900">${product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-forest-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-forest-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "text-forest-400 fill-current" : "text-forest-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="text-xs text-forest-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-forest-900">Colors</span>
                        <span className="text-xs text-forest-500">{product.colors.length} options</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {product.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 rounded-full border border-forest-200 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={`Color ${color.name}`}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-forest-500">+{product.colors.length - 4}</span>
                        )}
                      </div>
                    </div>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-forest-900">Sizes</span>
                          <span className="text-xs text-forest-500">{product.sizes.length} sizes</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-wrap gap-1">
                          {product.sizes.slice(0, 5).map((size, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                                size.inStock
                                  ? "bg-forest-100 text-forest-700 hover:bg-forest-200"
                                  : "bg-forest-50 text-forest-400 cursor-not-allowed"
                              }`}
                              aria-label={`Size ${size.name}`}
                            >
                              {size.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs font-medium text-forest-900">Qty:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="h-6 w-6 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 text-forest-600" />
                        </button>
                        <span className="w-6 text-center text-xs">{quantities[product.id] || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="h-6 w-6 rounded-full bg-forest-100 hover:bg-forest-200 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 text-forest-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-forest-900 text-forest-50 py-2 rounded-lg text-xs font-medium hover:bg-forest-600 transition-colors flex items-center justify-center space-x-1"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag className="h-3 w-3" />
                        <span>Add to Cart</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-4 py-2 border border-forest-900 text-forest-900 rounded-lg text-xs font-medium hover:bg-forest-900 hover:text-forest-50 transition-colors"
                        aria-label={`View details for ${product.name}`}
                      >
                        View
                      </motion.button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-forest-100">
                      <div className="grid grid-cols-2 gap-1">
                        {product.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-forest-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <CustomerReviews productId={product.id} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-forest-100 rounded-2xl"
            >
              <div className="max-w-sm mx-auto">
                <div className="h-16 w-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-forest-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-forest-900 mb-3">Coming Soon</h3>
                <p className="text-forest-600 text-sm mb-6 leading-relaxed">
                  We're curating the perfect pieces for this look. Check back soon!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="bg-forest-900 text-forest-50 px-6 py-2 rounded-lg text-sm font-medium hover:bg-forest-600 transition-colors"
                  aria-label="Browse all products"
                >
                  Browse All Products
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Promotional Banner */}
      <motion.section variants={itemVariants} className="py-12 bg-forest-600 text-forest-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Exclusive Offer</h2>
          <p className="text-base mb-6 max-w-2xl mx-auto">
            Get 15% off your first purchase when you shop this look today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-forest-50 text-forest-900 px-6 py-2 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center space-x-2 mx-auto"
            aria-label="Shop now"
          >
            <Tag className="h-4 w-4" />
            <span>Shop Now</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Related Lookbooks */}
      <motion.section variants={itemVariants} className="py-12 bg-forest-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mb-3">Explore More Looks</h2>
            <p className="text-base text-forest-600 max-w-2xl mx-auto">Discover other inspiring collections</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {lookbookItems
              .filter((item) => item.id !== id)
              .slice(0, 3)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group cursor-pointer bg-forest-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/shop-the-look/${item.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/shop-the-look/${item.id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-forest-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-serif font-bold">{item.title}</h3>
                      <p className="text-xs">{item.subtitle}</p>
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 right-3 bg-forest-600 text-forest-50 px-2 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-serif font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs text-forest-500">{item.season}</span>
                    </div>
                    <p className="text-forest-600 text-xs line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-forest-400" />
                        <span className="text-xs text-forest-500">{item.productIds.length} pieces</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-forest-400 group-hover:text-forest-600 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="bg-forest-900 text-forest-50 px-8 py-3 rounded-lg text-sm font-medium hover:bg-forest-600 transition-colors flex items-center space-x-2 mx-auto"
              aria-label="View all lookbooks"
            >
              <span>View All Lookbooks</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-forest-900/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Zoomed image"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl max-h-full"
            >
              <img
                src={lookbook.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${lookbook.title} zoomed image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-forest-50/20 backdrop-blur-sm text-forest-50 hover:bg-forest-50/30 flex items-center justify-center transition-all"
                aria-label="Close zoomed image"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Modal */}
      <AnimatePresence>
        {isSelectionModalOpen && selectedProduct && (
          <SelectionModal
            product={selectedProduct}
            isOpen={isSelectionModalOpen}
            onClose={() => setIsSelectionModalOpen(false)}
            onAddToCart={handleAddToCartConfirm}
          />
        )}
      </AnimatePresence>

      {/* Cart Summary Modal */}
      <AnimatePresence>
        {isCartModalOpen && (
          <CartSummaryModal
            cart={cart}
            products={products}
            isOpen={isCartModalOpen}
            onClose={() => setIsCartModalOpen(false)}
            onRemoveItem={handleRemoveCartItem}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopLookbook;
