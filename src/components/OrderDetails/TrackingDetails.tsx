import React from 'react';
import { Truck, CheckCircle, Package, Home } from 'lucide-react';
import { InfoCard } from './common';

const TrackingTimeline = ({ currentStatus, isCancelled }) => {
  const statuses = ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const activeStatus = isCancelled ? 'Order Confirmed' : currentStatus;
  const currentIndex = statuses.indexOf(activeStatus);

  return (
    <div className="flex items-center justify-between">
      {statuses.map((status, index) => (
        <React.Fragment key={status}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${index <= currentIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {status === 'Order Confirmed' && <CheckCircle size={20} />}
              {status === 'Shipped' && <Package size={20} />}
              {status === 'Out for Delivery' && <Truck size={20} />}
              {status === 'Delivered' && <Home size={20} />}
            </div>
            <p className={`mt-2 text-xs font-medium ${index <= currentIndex ? 'text-indigo-700' : 'text-gray-500'}`}>{status}</p>
          </div>
          {index < statuses.length - 1 && (
            <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${index < currentIndex ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

interface TrackingDetailsProps {
  status: string;
  isCancelled: boolean;
}

export const TrackingDetails: React.FC<TrackingDetailsProps> = ({ status, isCancelled }) => (
  <InfoCard icon={<Truck size={24} className="text-indigo-600" />} title="Live Order Tracking">
    <TrackingTimeline currentStatus={status} isCancelled={isCancelled} />
  </InfoCard>
);
