import type React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import Lookbook from './components/Lookbook';
import BrandStory from './components/BrandStory';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProductDetail from './components/ProductDetail';
import { products } from './data/products';
import Collections from './components/Collections';
import ShopLookbook from './components/ShopLookbook';
import About from './components/About';
import Contact from './components/Contact';
import DeliveryTracker from './components/DeliveryTracker';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import ReferralPage from './components/ReferralPage';
import PaymentModal from './components/PaymentModal';
import ProductPaymentDetails from './components/ProductPaymentDetails';

import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ReferralProvider } from './context/ReferralContext';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <FeaturedCollections />
    <Lookbook />
    <BrandStory />
    <Testimonials />
    <Newsletter />
  </>
);

const ProductDetailWrapper: React.FC<{ onRequestLogin: () => void; onBuyNow: (product: any, color: any, size: any, quantity: number) => void }> = ({ onRequestLogin, onBuyNow }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} onRequestLogin={onRequestLogin} onBuyNow={onBuyNow} />;
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authError, setAuthError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ items: [], total: 0, delivery: { id: 'standard', name: 'Standard', logo: '', price: 5, estimatedDays: '3-5' } });
  const [shouldHideNavbar, setShouldHideNavbar] = useState(false);

  const handleRequestLogin = () => {
    setIsAuthModalOpen(true);
    setAuthTab('signin');
    setAuthError('Please sign in to continue');
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleBuyNow = (product, color, size, quantity) => {
    const item = {
      id: `${product.id}-${color.value}-${size?.value || ''}`,
      product,
      selectedColor: color,
      selectedSize: size,
      quantity,
    };
    const total = product.price * quantity;
    setPaymentDetails({ items: [item], total, delivery: { id: 'standard', name: 'Standard', logo: '', price: 5, estimatedDays: '3-5' } });
    setIsPaymentModalOpen(true);
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <ReferralProvider>
          <Router>
            <div className="min-h-screen bg-white">
              {!shouldHideNavbar && (
                <Navigation
                  isAuthModalOpen={isAuthModalOpen}
                  setIsAuthModalOpen={setIsAuthModalOpen}
                  authTab={authTab}
                  setAuthTab={setAuthTab}
                  authError={authError}
                  setAuthError={setAuthError}
                  onCartOpen={handleCartOpen}
                />
              )}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailWrapper onRequestLogin={handleRequestLogin} onBuyNow={handleBuyNow} />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/shop-the-look" element={<ShopLookbook />} />
                <Route path="/shop-the-look/:id" element={<ShopLookbook />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track" element={<DeliveryTracker />} />
                <Route path="/checkout" element={<Checkout onRequestLogin={handleRequestLogin} />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route path="/order/:orderId" element={<ProductPaymentDetails setShouldHideNavbar={setShouldHideNavbar} />} />
              </Routes>
              <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onRequestLogin={handleRequestLogin}
              />
              <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                {...paymentDetails}
              />
              {!(window.location.pathname === '/order/:orderId') && (
                <>
                  <Footer />
                  <Chatbot />
                </>
              )}
            </div>
          </Router>
        </ReferralProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;