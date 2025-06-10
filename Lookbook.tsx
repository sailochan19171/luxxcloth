import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { LookbookItem } from '../types';

const Lookbook: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lookbookItems: LookbookItem[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      title: 'Executive Elegance',
      description: 'Sophisticated power dressing for the modern professional'
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      title: 'Weekend Luxe',
      description: 'Effortless luxury for your leisure moments'
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      title: 'Evening Glamour',
      description: 'Captivating elegance for special occasions'
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      title: 'Casual Chic',
      description: 'Refined comfort for everyday sophistication'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % lookbookItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + lookbookItems.length) % lookbookItems.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const shopTheLook = () => {
    alert('Navigate to Shop the Look page');
  };

  return (
    <>
      <section id="lookbook" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Lookbook
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our styled collections and discover how to create 
              unforgettable looks with our premium pieces.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {lookbookItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[600px] object-cover cursor-pointer"
                      onClick={openModal}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg mb-6 max-w-md">
                        {item.description}
                      </p>
                      <button
                        onClick={shopTheLook}
                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-amber-600 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                      >
                        <span>Shop the Look</span>
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} className="text-gray-900" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {lookbookItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl mx-4">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={lookbookItems[currentIndex].image}
              alt={lookbookItems[currentIndex].title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                {lookbookItems[currentIndex].title}
              </h3>
              <p className="text-lg mb-4">
                {lookbookItems[currentIndex].description}
              </p>
              <button
                onClick={shopTheLook}
                className="bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-700 transition-colors"
              >
                Shop the Look
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lookbook;