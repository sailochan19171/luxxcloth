import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Product, Color, Size } from "../types";
import VirtualTryOnWrapper from "../components/VirtualTryOnWraaper";

interface ProductDetailProps {
  product: Product;
  onRequestLogin?: () => void;
  onBack?: () => void;
  onAddToCart?: (product: Product, color: Color, size?: Size, quantity?: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onRequestLogin, onBack, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const navigate = useNavigate();

  const handleVirtualTryOnClick = () => {
    console.log("Opening Virtual Try-On with product:", product);
    console.log("Selected color:", selectedColor);

    if (!product || !selectedColor) {
      alert("Product or color not selected properly");
      return;
    }

    setShowVirtualTryOn(true);
  };

  const handleAddToCart = () => {
    if (!selectedColor || (product.sizes && !selectedSize)) {
      alert("Please select all required options");
      return;
    }

    if (onAddToCart) {
      onAddToCart(product, selectedColor, selectedSize || undefined, quantity);
    } else {
      alert("Added to cart successfully!");
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor || (product.sizes && !selectedSize)) {
      alert("Please select all required options");
      return;
    }

    if (onRequestLogin) {
      onRequestLogin();
      return;
    }

    navigate(
      `/payment?productId=${product.id}&color=${encodeURIComponent(selectedColor.value)}&size=${
        selectedSize ? encodeURIComponent(selectedSize.value) : ""
      }&quantity=${quantity}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack || (() => window.history.back())}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Collections</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="relative group">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="rounded-lg shadow-md" />
          {(product.canTryOn ||
            ["Outerwear", "Dresses", "Blazers", "Knitwear", "Shirts", "Tops", "Jackets"].includes(
              product.category
            )) && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleVirtualTryOnClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <Sparkles size={18} />
                <span>AI Virtual Try-On</span>
              </button>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-4">${product.price.toFixed(2)}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">Color:</h2>
            <div className="flex items-center mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full mr-2 focus:outline-none ${selectedColor?.value === color.value ? "ring-2 ring-purple-500" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700">Size:</h2>
              <div className="flex items-center mt-2 space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`px-4 py-2 border rounded-lg font-medium ${
                      selectedSize?.value === size.value
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    } ${!size.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => size.inStock && setSelectedSize(size)}
                    disabled={!size.inStock}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">Quantity:</h2>
            <div className="flex items-center mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 bg-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {(product.canTryOn ||
            ["Outerwear", "Dresses", "Blazers", "Knitwear", "Shirts", "Tops", "Jackets"].includes(
              product.category
            )) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 flex items-center">
                    <Sparkles size={18} className="mr-2" />
                    AI Virtual Try-On Available
                  </h3>
                  <p className="text-purple-700 text-sm mt-1">
                    Upload your photo and see how this {product.category.toLowerCase()} looks on you with our AI-powered
                    virtual try-on
                  </p>
                </div>
                <button
                  onClick={handleVirtualTryOnClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-sm"
                >
                  Try Now
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-8 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-8 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <VirtualTryOnWrapper
        product={product}
        selectedColor={selectedColor?.value}
        onClose={() => setShowVirtualTryOn(false)}
        isOpen={showVirtualTryOn}
      />
    </div>
  );
};

export default ProductDetail;
