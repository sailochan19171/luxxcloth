import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { products, deliveryPartners } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Product, Color, Size } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { currentTheme } = useTheme();
  
  const product = products.find(p => p.id === id);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryPartners[1]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-amber-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Set default selections
  React.useEffect(() => {
    if (!selectedColor && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (!selectedSize && product.sizes.length > 0) {
      setSelectedSize(product.sizes.find(s => s.inStock) || product.sizes[0]);
    }
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        color: selectedColor,
        size: selectedSize,
        quantity
      }
    });

    alert('Added to cart successfully!');
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + parseInt(selectedDelivery.estimatedDays.split('-')[1]));

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Collections</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with 3D Effect */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-stone-100 to-amber-50 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-amber-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Color: {selectedColor?.name}
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor?.value === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Size: {selectedSize?.name}
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size)}
                    disabled={!size.inStock}
                    className={`py-3 px-4 border rounded-lg font-medium transition-all ${
                      selectedSize?.value === size.value
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : size.inStock
                        ? 'border-gray-300 hover:border-gray-900'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h3>
              <div className="space-y-3">
                {deliveryPartners.map((partner) => (
                  <label
                    key={partner.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDelivery.id === partner.id
                        ? 'border-amber-600 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery.id === partner.id}
                        onChange={() => setSelectedDelivery(partner)}
                        className="text-amber-600"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{partner.logo}</span>
                          <span className="font-medium">{partner.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">{partner.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${partner.price}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Truck size={16} />
                  <span className="text-sm font-medium">
                    Estimated delivery: {estimatedDelivery.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 px-8 rounded-full font-medium text-lg transition-all transform hover:-translate-y-1 ${
                  product.inStock
                    ? `bg-${currentTheme.secondary} text-white hover:bg-${currentTheme.primary} shadow-lg hover:shadow-xl`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button className="w-full py-4 px-8 border-2 border-gray-900 text-gray-900 rounded-full font-medium text-lg hover:bg-gray-900 hover:text-white transition-all">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="text-gray-600" size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-600">On orders over $100</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="text-gray-600" size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-600">30-day return policy</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="text-gray-600" size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">Warranty</div>
                <div className="text-xs text-gray-600">1-year guarantee</div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6 pt-8 border-t border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Materials</h4>
                <ul className="space-y-2">
                  {product.materials.map((material, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                <ul className="space-y-2">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;