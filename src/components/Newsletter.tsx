import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    emailjs.init('c4aTz4i6jK-TI-L-z');
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const templateParams = {
        to_email: email,
        user_email: email,
        reply_to: email,
      };

      const response = await emailjs.send(
        'service_fiye637',
        'template_7u14heo',
        templateParams,
        'c4aTz4i6jK-TI-L-z'
      );

      if (response.status !== 200) {
        throw new Error(`Failed to send subscription email: ${response.text}`);
      }

      await fetch('http://localhost:5001/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      window.gtag?.('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: email,
      });

      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      window.gtag?.('event', 'newsletter_error', {
        event_category: 'error',
        event_label: errorMessage,
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="text-amber-600" size={32} />
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Join Our Exclusive List
        </h2>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to discover new collections, exclusive offers, and styling tips
          from our fashion experts. Subscribe to our newsletter and elevate your style journey.
        </p>

        {!isSubmitted ? (
          <div className="max-w-md mx-auto">
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-full border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none text-gray-900 placeholder-gray-500 shadow-lg"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
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
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-amber-600">
                Privacy Policy
              </a>
              .
            </p>
          </div>
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
