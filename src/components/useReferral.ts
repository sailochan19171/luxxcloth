import { useContext } from 'react';
import { ReferralContext } from '../context/ReferralContext';

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }

  return context;
};