import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface CartItem {
  id: string;
  product: {
    name: string;
    image: string;
    price: number;
  };
  selectedColor: { name: string };
  selectedSize: { name: string };
  quantity: number;
}

interface DeliveryPartner {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedDays: string;
}

interface CheckoutState {
  items: CartItem[];
  subtotal: number;
  delivery: DeliveryPartner;
  tax: number;
  total: number;
}

interface CheckoutProps {
  onRequestLogin: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onRequestLogin }) => {
  const { state } = useLocation();
  const { items, subtotal, delivery, tax, total } = (state as CheckoutState) || {};
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Items in Checkout</h2>
        <button
          onClick={() => navigate('/')}
          className={`bg-${currentTheme.secondary} text-white px-6 py-3 rounded-full hover:bg-${currentTheme.primary} transition-colors`}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCompletePurchase = () => {
    // Check if user is logged in using Firebase auth
    if (!currentUser) {
      onRequestLogin();
      return;
    }
    
    // Placeholder for payment processing logic
    alert('Payment processing not implemented. This is a placeholder.');
    // Example: navigate to an order confirmation page
    // navigate('/order-confirmation');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Color: {item.selectedColor.name}</span>
                  <span>Size: {item.selectedSize.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery and Payment */}
        <div className="space-y-6">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Details</h3>
            <div className="flex items-center space-x-2 mb-2">
              <span>{delivery.logo}</span>
              <span className="font-medium">{delivery.name}</span>
            </div>
            <p className="text-sm text-gray-600">{delivery.estimatedDays}</p>
            <p className="text-sm font-medium">${delivery.price.toFixed(2)}</p>
          </div>

          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Total</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>${delivery.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompletePurchase}
            className={`w-full bg-${currentTheme.secondary} text-white py-4 rounded-full font-medium hover:bg-${currentTheme.primary} transition-colors flex items-center justify-center space-x-2`}
          >
            <CreditCard size={20} />
            <span>Complete Purchase</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
