import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-lg font-bold text-gray-800 ml-3">{title}</h2>
    </div>
    <div className="text-gray-600 space-y-4">{children}</div>
  </div>
);
