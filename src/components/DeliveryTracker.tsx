import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable, } from 'firebase/functions';
// Assuming firebaseApp is initialized elsewhere if needed, or using default app.
// import { firebaseApp } from './firebase';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingData {
  orderId: string;
  status: string;
  shipmentStatus: string;
  liveLocation: string;
  orderDate?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  // Add other fields as expected from your cloud function
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOrderIdInput('');
      setTrackingData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleTrackOrder = async () => {
    if (!orderIdInput.trim()) {
      setError('Please enter an Order ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    const functions = getFunctions(); // Pass firebaseApp if you have a specific instance
    const getOrderTrackingInfoFn = httpsCallable(functions, 'getOrderTrackingInfo');

    try {
      const result = await getOrderTrackingInfoFn({ orderId: orderIdInput });
      // The httpsCallable result has data nested in result.data
      setTrackingData(result.data as TrackingData);
      setError(null);
    } catch (err: unknown ) {
      console.error("Error calling getOrderTrackingInfo:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve tracking information.';
      setError(errorMessage);
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 text-gray-200 p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-amber-400">Track Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Enter your Order ID"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-amber-500 focus:border-amber-500 mb-4 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={handleTrackOrder}
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-150 ease-in-out mb-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Tracking...' : 'Track Order'}
        </button>
        <div className="mt-4 p-4 border border-gray-700 rounded-md bg-gray-900 min-h-[100px]">
          {isLoading && <p className="text-gray-400 text-center">Loading tracking information...</p>}
          {error && <p className="text-red-400 text-center">Error: {error}</p>}
          {trackingData && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-amber-500 mb-3 text-center">Tracking Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="font-semibold text-gray-300">Order ID:</p>
                  <p className="text-gray-100 break-all">{trackingData.orderId}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-300">Status:</p>
                  <p className="text-gray-100">{trackingData.status}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-300">Shipment Status:</p>
                  <p className="text-gray-100">{trackingData.shipmentStatus}</p>
                </div>
                {trackingData.trackingNumber && trackingData.trackingNumber !== 'N/A' && (
                  <div>
                    <p className="font-semibold text-gray-300">Tracking #:</p>
                    <p className="text-gray-100">{trackingData.trackingNumber}</p>
                  </div>
                )}
                {trackingData.carrier && trackingData.carrier !== 'N/A' && (
                  <div>
                    <p className="font-semibold text-gray-300">Carrier:</p>
                    <p className="text-gray-100">{trackingData.carrier}</p>
                  </div>
                )}
                {trackingData.orderDate && trackingData.orderDate !== 'N/A' && (
                  <div>
                    <p className="font-semibold text-gray-300">Order Date:</p>
                    <p className="text-gray-100">{trackingData.orderDate.split('T')[0]}</p>
                  </div>
                )}
                {trackingData.estimatedDelivery && trackingData.estimatedDelivery !== 'N/A' && (
                  <div>
                    <p className="font-semibold text-gray-300">Est. Delivery:</p>
                    <p className="text-gray-100">{trackingData.estimatedDelivery.split('T')[0]}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="font-semibold text-gray-300">Location Details:</p>
                  <p className="text-gray-100">{trackingData.liveLocation}</p>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !trackingData && <p className="text-gray-400 text-center">Tracking information will appear here...</p>}
        </div>
      </div>
    </div>
  );
};

// Wrapper component for route usage
const DeliveryTracker: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/'); // Navigate back to home page when closing
  };

  return <OrderTrackingModal isOpen={true} onClose={handleClose} />;
};

export default DeliveryTracker;
export { OrderTrackingModal };
