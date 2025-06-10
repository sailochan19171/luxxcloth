import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="text-amber-600" size={32} />
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Join Our Exclusive List
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to discover new collections, exclusive offers, and styling tips 
          from our fashion experts. Subscribe to our newsletter and elevate your style journey.
        </p>

        {/* Newsletter Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-full border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none text-gray-900 placeholder-gray-500 shadow-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center justify-center space-x-3">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-800 font-medium">
                Successfully subscribed! Check your email for confirmation.
              </span>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Exclusive Offers</h3>
            <p className="text-gray-600 text-sm">Get early access to sales and member-only discounts</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">New Arrivals</h3>
            <p className="text-gray-600 text-sm">Be first to discover our latest collections</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Style Tips</h3>
            <p className="text-gray-600 text-sm">Expert styling advice and fashion inspiration</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Join over 50,000+ fashion enthusiasts worldwide
          </p>
          <div className="flex justify-center items-center space-x-6 text-gray-400">
            <span className="text-xs">📧 No spam, ever</span>
            <span className="text-xs">🔒 Your data is secure</span>
            <span className="text-xs">📱 Mobile optimized</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;