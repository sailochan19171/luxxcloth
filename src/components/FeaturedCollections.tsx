import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { products } from '../data/products';
import LazyImage from './LazyImage';

const FeaturedCollections: React.FC = () => {
  const navigate = useNavigate();

  const openProductDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const openAllCollections = () => {
    navigate('/collections');
  };

  // Show first 6 products for featured collections
  const featuredProducts = products.slice(0, 6);

  return (
    <section id="collections" className="py-24 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-stone-900/10 to-emerald-900/20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Refined Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-amber-100/80 backdrop-blur-sm text-amber-900 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-amber-200/50">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span>Curated Selection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
            Featured Collections
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-stone-600 mx-auto mb-8"></div>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-light">
            Discover our carefully curated selection of premium fashion pieces, each chosen for its exceptional quality and timeless elegance.
          </p>
        </div>

        {/* Professional Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-stone-200/50"
              onClick={() => openProductDetail(product.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Refined Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 shadow-sm border border-stone-200/50">
                    {product.category}
                  </div>
                  {product.originalPrice && (
                    <div className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      SALE
                    </div>
                  )}
                  {product.isNew && (
                    <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      NEW
                    </div>
                  )}
                </div>

                {/* Refined Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm text-stone-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-stone-200/50 transform hover:scale-110">
                    <Heart size={16} />
                  </button>
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm text-stone-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm border border-stone-200/50 transform hover:scale-110">
                    <Eye size={16} />
                  </button>
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm text-stone-600 rounded-lg hover:bg-stone-600 hover:text-white transition-all shadow-sm border border-stone-200/50 transform hover:scale-110">
                    <ShoppingBag size={16} />
                  </button>
                </div>

                {/* Refined Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="bg-white/95 backdrop-blur-sm text-stone-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-stone-900 hover:text-white transition-all duration-300 transform hover:scale-105 border border-stone-200/50">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Refined Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-stone-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-stone-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-stone-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating) ? 'text-amber-500 fill-current' : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-stone-500 ml-1 font-medium">({product.reviews})</span>
                  </div>
                </div>

                {/* Refined Color Options */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-stone-600 font-medium">Colors:</span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-5 h-5 rounded-full border-2 border-stone-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-full">
                          +{product.colors.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  {product.inStock ? (
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs text-rose-700 font-semibold bg-rose-100 px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Refined View Details Button */}
                <button className="w-full bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 flex items-center justify-center space-x-2 group/btn shadow-sm hover:shadow-md transform hover:scale-[1.02]">
                  <span>View Details</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Refined View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={openAllCollections}
            className="group bg-gradient-to-r from-stone-900 to-amber-800 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-stone-800 transition-all duration-500 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mx-auto border border-stone-700/20"
          >
            <span>View All Collections</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="text-stone-600 mt-4 text-base font-light">
            Discover our complete collection of {products.length} premium pieces
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
