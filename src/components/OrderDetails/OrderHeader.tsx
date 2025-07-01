import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';

interface OrderHeaderProps {
  orderId: string;
  onCopy: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId, onCopy }) => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>Order ID: {orderId}</span>
          <button onClick={onCopy} className="ml-2 p-1 rounded-md hover:bg-gray-100"><Copy size={14} /></button>
        </div>
      </div>
      <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
        <ArrowLeft size={20} />
        <span>Back to Shop</span>
      </Link>
    </div>
  </header>
);
