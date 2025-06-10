import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - 3D Product Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                  alt="Featured Fashion Item"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Elevate Your
              <span className="block text-amber-600">Wardrobe</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Discover timeless elegance with our curated collection of luxury fashion pieces, 
              crafted for the discerning individual who values quality and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('#collections')}
                className="group bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('#lookbook')}
                className="group border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Play size={18} />
                <span>View Lookbook</span>
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600 text-sm">Curated Pieces</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-gray-600 text-sm">Global Brands</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;