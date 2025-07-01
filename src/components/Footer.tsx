import React, { useState } from 'react';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, Package, X, ChevronDown, ChevronUp } from 'lucide-react';

// Type for AfterShip tracking response
interface TrackingInfo {
  tracking_number: string;
  slug: string;
  title: string;
  status: string;
  last_update: string;
  expected_delivery: string | null;
  checkpoints: {
    status: string;
    location: string;
    checkpoint_time: string;
  }[];
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    quickLinks: false,
    customerService: false,
    stayConnected: false,
  });

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Collections', href: '#collections' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const customerServiceLinks = [
    { label: 'Shipping Info', href: '#' },
    { label: 'Returns & Exchanges', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'Care Instructions', href: '#' },
    { label: 'Track Your Order', action: () => setIsTrackingModalOpen(true) },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Return Policy', href: '#' },
    { label: 'Size Guide', href: '#' },
  ];

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingInfo(null);

    try {
      const response = await fetch(`/api/track?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      const data = await response.json();

      if (data.meta.code !== 200) {
        throw new Error(data.meta.message || 'Failed to fetch tracking information');
      }

      setTrackingInfo(data.data.tracking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsTrackingModalOpen(false);
    setTrackingNumber('');
    setTrackingInfo(null);
    setError(null);
    setIsLoading(false);
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Info */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">LUXE</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Crafting timeless elegance through exceptional design and uncompromising quality.
                  Every piece tells a story of sophistication and style.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone size={14} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail size={14} />
                  <span>hello@luxefashion.com</span>
                </div>
                <div className="flex items-start space-x-2 text-gray-300">
                  <MapPin size={14} className="mt-0.5" />
                  <span>123 Fashion Avenue<br />New York, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <button
                onClick={() => toggleSection('quickLinks')}
                className="w-full flex justify-between items-center text-lg font-semibold text-white mb-4 md:mb-6 focus:outline-none"
              >
                <span>Quick Links</span>
                <span className="md:hidden">
                  {openSections.quickLinks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              <ul
                className={`space-y-2 text-sm ${openSections.quickLinks || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}
              >
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-300 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <button
                onClick={() => toggleSection('customerService')}
                className="w-full flex justify-between items-center text-lg font-semibold text-white mb-4 md:mb-6 focus:outline-none"
              >
                <span>Customer Service</span>
                <span className="md:hidden">
                  {openSections.customerService ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              <ul
                className={`space-y-2 text-sm ${openSections.customerService || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}
              >
                {customerServiceLinks.map((link) => (
                  <li key={link.label}>
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="text-gray-300 hover:text-amber-400 transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="text-gray-300 hover:text-amber-400 transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay Connected */}
            <div>
              <button
                onClick={() => toggleSection('stayConnected')}
                className="w-full flex justify-between items-center text-lg font-semibold text-white mb-4 md:mb-6 focus:outline-none"
              >
                <span>Stay Connected</span>
                <span className="md:hidden">
                  {openSections.stayConnected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              <div
                className={`space-y-4 ${openSections.stayConnected || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}
              >
                <p className="text-gray-300 text-sm">
                  Follow us for the latest updates and style inspiration.
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors group"
                      aria-label={social.label}
                    >
                      <social.icon size={18} className="text-gray-300 group-hover:text-white" />
                    </a>
                  ))}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-xs text-gray-400">Recognized by:</div>
                  <div className="text-xs text-amber-400">🏆 Fashion Excellence Award 2023</div>
                  <div className="text-xs text-amber-400">⭐ Luxury Brand of the Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-sm">
              <div className="text-gray-400 text-center md:text-left">
                © {currentYear} LUXE Fashion. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-4">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Tracking Modal */}
      {isTrackingModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracking-modal-title"
        >
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h2 id="tracking-modal-title" className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Track Your Order
            </h2>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700">
                  Tracking Number
                </label>
                <div className="mt-1 relative">
                  <Package size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="tracking-number"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors text-sm ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isLoading ? 'Loading...' : 'Track Order'}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {trackingInfo && (
              <div className="mt-4 space-y-4 text-sm">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-base font-semibold text-gray-900">Tracking Details</h3>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tracking Number</dt>
                      <dd className="font-medium">{trackingInfo.tracking_number}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Carrier</dt>
                      <dd className="font-medium">{trackingInfo.title}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Status</dt>
                      <dd className="font-medium capitalize">{trackingInfo.status.replace('_', ' ')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Last Update</dt>
                      <dd className="font-medium">
                        {new Date(trackingInfo.last_update).toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Estimated Delivery</dt>
                      <dd className="font-medium">
                        {trackingInfo.expected_delivery
                          ? new Date(trackingInfo.expected_delivery).toLocaleDateString()
                          : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900">Shipment History</h4>
                  <ul className="mt-2 space-y-2">
                    {trackingInfo.checkpoints.map((checkpoint, index) => (
                      <li key={index}>
                        <div className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {checkpoint.status.replace('_', ' ')}
                          </span>
                          <span className="font-medium">
                            {new Date(checkpoint.checkpoint_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-gray-500">{checkpoint.location}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
