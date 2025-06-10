import React from 'react';
import { ArrowRight, Award, Users, Globe } from 'lucide-react';

const BrandStory: React.FC = () => {
  const scrollToAbout = () => {
    alert('Navigate to About page');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-stone-100 to-amber-50 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                  alt="Brand Story"
                  className="w-full h-[600px] object-cover mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">
                Our Story
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Crafting Timeless 
              <span className="block text-amber-600">Elegance</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              For over two decades, LUXE has been synonymous with exceptional craftsmanship 
              and timeless design. Our journey began with a simple vision: to create clothing 
              that transcends seasons and trends, pieces that become treasured parts of your wardrobe.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every piece in our collection is carefully curated from the finest materials 
              and crafted by skilled artisans who share our passion for perfection. We believe 
              that true luxury lies not just in what you wear, but in how it makes you feel.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-amber-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-amber-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="text-amber-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-900">30+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>

            <button
              onClick={scrollToAbout}
              className="group bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-amber-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Explore Our Story</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;