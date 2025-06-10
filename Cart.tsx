import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { deliveryPartners } from '../data/products';
import PaymentModal from './PaymentModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const { currentTheme } = useTheme();
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryPartners[1]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const subtotal = state.total;
  const deliveryFee = selectedDelivery.price;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={24} className="text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Shopping Cart ({state.itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some items to get started</p>
                  <button
                    onClick={onClose}
                    className={`bg-${currentTheme.secondary} text-white px-6 py-3 rounded-full hover:bg-${currentTheme.primary} transition-colors`}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Color: {item.selectedColor.name}</span>
                          <span>Size: {item.selectedSize.name}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">Delivery Options</h3>
                    <div className="space-y-2">
                      {deliveryPartners.map((partner) => (
                        <label
                          key={partner.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedDelivery.id === partner.id
                              ? `border-${currentTheme.primary} bg-${currentTheme.accent}`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="delivery"
                              checked={selectedDelivery.id === partner.id}
                              onChange={() => setSelectedDelivery(partner)}
                              className={`text-${currentTheme.primary}`}
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span>{partner.logo}</span>
                                <span className="font-medium text-sm">{partner.name}</span>
                              </div>
                              <div className="text-xs text-gray-600">{partner.estimatedDays}</div>
                            </div>
                          </div>
                          <span className="font-medium text-sm">${partner.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
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

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className={`w-full bg-${currentTheme.secondary} text-white py-4 rounded-full font-medium hover:bg-${currentTheme.primary} transition-colors flex items-center justify-center space-x-2`}
                >
                  <CreditCard size={20} />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        items={state.items}
        delivery={selectedDelivery}
      />
    </>
  );
};

export default Cart;