import React, { useState } from 'react';
import { X, Copy, Share2, MessageCircle, Mail, Facebook, Twitter, Linkedin, QrCode } from 'lucide-react';
import { useReferral } from './useReferral';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferralShareModal: React.FC<ReferralShareModalProps> = ({ isOpen, onClose }) => {
  const { generateReferralLink, state } = useReferral();
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  if (!isOpen || !state.currentUser) return null;

  const referralLink = generateReferralLink();
  const shareMessage = `Discover luxury fashion at LUXX! Get exclusive discounts on premium clothing and accessories. Use my referral link to save on your first order: ${referralLink}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent('Check out LUXX Fashion!')}&body=${encodeURIComponent(shareMessage)}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join LUXX - Premium Fashion',
          text: 'Discover luxury fashion with exclusive discounts!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  const generateQRCode = async () => {
    // For production, use a proper QR code library like qrcode
    // This is a placeholder using a QR code API
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}`;
    setQrCodeUrl(url);
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Share & Earn</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn $25 + 15% Off Coupon</h3>
            <p className="text-gray-600 text-sm">For every friend who joins using your link!</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Copy size={16} />
              <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Share via</h3>
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShare(option.url)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-xl ${option.color} text-white hover:opacity-90 transition-opacity`}
              >
                <option.icon size={20} />
                <span className="text-xs font-medium">{option.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                if (!qrCodeVisible || !qrCodeUrl) {
                  generateQRCode();
                }
                setQrCodeVisible(!qrCodeVisible);
              }}
              className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-gray-700 text-white hover:opacity-90 transition-opacity"
            >
              <QrCode size={20} />
              <span className="text-xs font-medium">QR Code</span>
            </button>
          </div>
        </div>

        {qrCodeVisible && qrCodeUrl && (
          <div className="mb-4 text-center">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="mx-auto rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-2">Scan to visit your referral link</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Share2 size={18} />
            <span>Share Now</span>
          </button>
          <button
            onClick={() => copyToClipboard(shareMessage)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Copy size={18} />
            <span>Copy Message</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Your friends get 10% off their first order, and you earn rewards when they make a purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralShareModal;
