import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Palette } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import ThemeSelector from './ThemeSelector';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const { state } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Collections', href: '#collections' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection('#home')}
                className="text-2xl font-serif font-bold text-gray-900 hover:text-amber-600 transition-colors"
              >
                LUXE
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors">
                <User size={20} />
              </button>
              <button 
                onClick={() => setIsThemeSelectorOpen(true)}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
              >
                <Palette size={20} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">LUXE</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-3 px-4 text-lg text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-amber-600">
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsThemeSelectorOpen(true);
                  }}
                  className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <Palette size={20} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ThemeSelector isOpen={isThemeSelectorOpen} onClose={() => setIsThemeSelectorOpen(false)} />
    </>
  );
};

export default Navigation;