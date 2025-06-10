import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
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

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
            <Footer />
            <Chatbot />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;