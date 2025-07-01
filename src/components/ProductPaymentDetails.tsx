import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ShieldCheck, Truck, ArrowLeft, Package, Home, CalendarPlus, HelpCircle, CreditCard, Copy, FileText, UploadCloud, Download, MessageCircle, Star, MapPin, Clock, AlertCircle, RefreshCw, Phone, Mail, User, Edit3, Camera, Send, Paperclip, ThumbsUp, ThumbsDown, MoreHorizontal, Navigation, Route, Timer, Bell, CheckCheck, Info, ExternalLink, Zap, Shield, Award, Heart, Share2, Bookmark, Filter, Search, SortAsc, Grid, List, Eye, EyeOff, Lock, Unlock, Settings, Archive, Flag, Tag, Calendar, Globe, Wifi, WifiOff, Battery, Signal, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Maximize, Minimize, RotateCw, RotateCcw, ZoomIn, ZoomOut, Move, Crop, Scissors, PenTool, Type, Image, Video, Music, File, Folder, FolderOpen, Save, Upload, UploadCloud as CloudUpload, DownloadCloud as CloudDownload } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types and Interfaces
interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  location: string;
  isCompleted: boolean;
  estimatedTime?: string;
  actualTime?: string;
  carrier?: string;
  trackingNumber?: string;
}

interface DeliveryInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: Date;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  deliveryInstructions?: string;
  signatureRequired: boolean;
  deliveryWindow: {
    start: string;
    end: string;
  };
}

interface LiveTrackingData {
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  nextStop: string;
  estimatedArrival: Date;
  driverInfo: {
    name: string;
    phone: string;
    vehicleInfo: string;
  };
  isLive: boolean;
  lastUpdated: Date;
}

// Enhanced InfoCard Component
const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  actions?: React.ReactNode;
}> = ({ 
  icon, 
  title, 
  children, 
  className = '', 
  collapsible = false, 
  defaultExpanded = true,
  actions 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon}
            <h2 className="text-lg font-bold text-gray-800 ml-3">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {actions}
            {collapsible && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft size={16} className="transform rotate-90" />
                </motion.div>
              </button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {(!collapsible || isExpanded) && (
            <motion.div
              initial={collapsible ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-600 space-y-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Tracking Timeline Component
const TrackingTimeline: React.FC<{
  events: TrackingEvent[];
  currentStatus: string;
  isCancelled: boolean;
  liveData?: LiveTrackingData;
}> = ({ events, currentStatus, isCancelled, liveData }) => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const displayEvents = showAllEvents ? events : events.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Live Tracking Banner */}
      {liveData?.isLive && !isCancelled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Truck size={24} className="text-green-600" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </div>
              <div>
                <p className="font-semibold text-green-800">Live Tracking Active</p>
                <p className="text-sm text-green-600">
                  Driver: {liveData.driverInfo.name} • {liveData.driverInfo.vehicleInfo}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-800">
                ETA: {liveData.estimatedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-green-600">
                Last updated: {liveData.lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Events */}
      <div className="space-y-4">
        {displayEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                event.isCompleted 
                  ? 'bg-indigo-600 text-white' 
                  : event.status === currentStatus
                  ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {event.status === 'Order Confirmed' && <CheckCircle size={20} />}
                {event.status === 'Processing' && <Package size={20} />}
                {event.status === 'Shipped' && <Truck size={20} />}
                {event.status === 'Out for Delivery' && <Navigation size={20} />}
                {event.status === 'Delivered' && <Home size={20} />}
              </div>
              {index < displayEvents.length - 1 && (
                <div className={`w-0.5 h-12 mt-2 transition-all duration-500 ${
                  event.isCompleted ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${
                  event.isCompleted ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {event.status}
                </h3>
                <span className="text-sm text-gray-500">
                  {event.actualTime || event.estimatedTime}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              {event.location && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  {event.location}
                </div>
              )}
              {event.trackingNumber && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Package size={12} className="mr-1" />
                  Tracking: {event.trackingNumber}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {events.length > 4 && (
        <button
          onClick={() => setShowAllEvents(!showAllEvents)}
          className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2"
        >
          {showAllEvents ? 'Show Less' : `Show ${events.length - 4} More Events`}
        </button>
      )}
    </div>
  );
};

// Enhanced Delivery Information Component
const DeliveryInformation: React.FC<{
  deliveryInfo: DeliveryInfo;
  liveData?: LiveTrackingData;
}> = ({ deliveryInfo, liveData }) => {
  const [showMap, setShowMap] = useState(true);

  const formatDeliveryWindow = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      {/* Delivery Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-indigo-900">Delivery Details</h3>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              {deliveryInfo.estimatedDelivery.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Carrier</p>
            <p className="font-medium text-gray-900">{deliveryInfo.carrier}</p>
          </div>
          <div>
            <p className="text-gray-600">Tracking Number</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900">{deliveryInfo.trackingNumber}</p>
              <button
                onClick={() => navigator.clipboard.writeText(deliveryInfo.trackingNumber)}
                className="p-1 rounded hover:bg-white/50"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-600">Delivery Window</p>
            <p className="font-medium text-gray-900">
              {formatDeliveryWindow(deliveryInfo.deliveryWindow.start, deliveryInfo.deliveryWindow.end)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Signature Required</p>
            <p className="font-medium text-gray-900">
              {deliveryInfo.signatureRequired ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Location */}
      {liveData?.isLive && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-900 flex items-center">
              <Navigation size={16} className="mr-2" />
              Live Location
            </h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={16} className="text-green-600" />
            </motion.div>
          </div>
          <p className="text-sm text-green-700 mb-2">
            Current Location: {liveData.currentLocation.address}
          </p>
          <p className="text-sm text-green-700">
            Next Stop: {liveData.nextStop}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-green-600">
              ETA: {liveData.estimatedArrival.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <a
              href={`tel:${liveData.driverInfo.phone}`}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
            >
              Call Driver
            </a>
          </div>
        </div>
      )}

      {/* Delivery Address */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Delivery Address</h3>
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="font-medium text-gray-900">{deliveryInfo.deliveryAddress.name}</p>
          <p className="text-gray-700">{deliveryInfo.deliveryAddress.street}</p>
          <p className="text-gray-700">
            {deliveryInfo.deliveryAddress.city}, {deliveryInfo.deliveryAddress.state} {deliveryInfo.deliveryAddress.zipCode}
          </p>
          <p className="text-gray-700">{deliveryInfo.deliveryAddress.country}</p>
          
          {deliveryInfo.deliveryInstructions && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">Delivery Instructions:</p>
              <p className="text-sm text-gray-800">{deliveryInfo.deliveryInstructions}</p>
            </div>
          )}
        </div>

        {/* Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 200, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="rounded-lg overflow-hidden border"
            >
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-74.0059,40.7128,-73.9959,40.7228&layer=mapnik&marker=40.7178,-74.0009`}
                className="w-full h-full border-0"
                loading="lazy"
                title="Delivery Location"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Invoice Modal Component
const InvoiceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: any;
}> = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
      pdf.save(`invoice-${order.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!isOpen) return null;

  const subtotal = order.items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        <header className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-800">Invoice</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Download size={18} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </header>
        
        <div className="overflow-y-auto p-2">
          <div ref={invoiceRef} className="p-8 bg-white font-serif text-gray-800">
            <div className="grid grid-cols-2 items-end mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-sm">Invoice #: {order.orderId}</p>
                <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold">LUXE Fashion</h2>
                <p className="text-sm">123 Fashion Avenue</p>
                <p className="text-sm">New York, NY 10001</p>
              </div>
            </div>
            
            <div className="border-t border-b py-6 my-6">
              <h3 className="font-semibold mb-4">Bill To:</h3>
              <p>123 Luxury Lane</p>
              <p>Fashion City, FS 12345</p>
            </div>
            
            <table className="w-full text-left mb-8">
              <thead>
                <tr className="border-b">
                  <th className="py-2 font-semibold">Item</th>
                  <th className="py-2 font-semibold text-center">Qty</th>
                  <th className="py-2 font-semibold text-right">Price</th>
                  <th className="py-2 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.product?.id} className="border-b">
                    <td className="py-4">{item.product?.name}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.product?.price?.toFixed(2)}</td>
                    <td className="py-4 text-right">${(item.product?.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Shipping:</span>
                  <span>${order.delivery?.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main OrderDetails Component
const OrderDetails: React.FC<{ setShouldHideNavbar: (shouldHide: boolean) => void }> = ({ 
  setShouldHideNavbar 
}) => {
  const { state } = useLocation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = state?.order;

  // State Management
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [currentStatus, setCurrentStatus] = useState('Order Confirmed');
  const [cancellationStatus, setCancellationStatus] = useState<'idle' | 'confirming' | 'cancelled'>('idle');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [liveTrackingData, setLiveTrackingData] = useState<LiveTrackingData | null>(null);
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize delivery information and tracking events
  useEffect(() => {
    if (!order) return;

    // Set up delivery information
    const deliveryData: DeliveryInfo = {
      carrier: 'FedEx Express',
      trackingNumber: `FX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      deliveryAddress: {
        name: 'Alexandra Chen',
        street: '123 Luxury Lane',
        city: 'Fashion City',
        state: 'FS',
        zipCode: '12345',
        country: 'USA',
        coordinates: { lat: 40.7178, lng: -74.0009 }
      },
      deliveryInstructions: 'Please leave package at front door if no answer. Ring doorbell twice.',
      signatureRequired: true,
      deliveryWindow: {
        start: '9:00 AM',
        end: '6:00 PM'
      }
    };

    setDeliveryInfo(deliveryData);

    // Initialize tracking events
    const events: TrackingEvent[] = [
      {
        id: '1',
        status: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared for shipment.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: 'LUXE Fulfillment Center, New York',
        isCompleted: true,
        actualTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
        trackingNumber: deliveryData.trackingNumber
      },
      {
        id: '2',
        status: 'Processing',
        description: 'Items are being picked and packed at our fulfillment center.',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        location: 'LUXE Fulfillment Center, New York',
        isCompleted: true,
        actualTime: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toLocaleString()
      },
      {
        id: '3',
        status: 'Shipped',
        description: 'Package has been shipped and is on its way to the delivery facility.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: 'FedEx Facility, Newark, NJ',
        isCompleted: false,
        estimatedTime: 'Today, 2:00 PM',
        carrier: 'FedEx Express'
      },
      {
        id: '4',
        status: 'Out for Delivery',
        description: 'Package is out for delivery and will arrive today.',
        timestamp: new Date(),
        location: 'Local Delivery Facility',
        isCompleted: false,
        estimatedTime: 'Today, 4:00 PM'
      },
      {
        id: '5',
        status: 'Delivered',
        description: 'Package has been successfully delivered.',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: deliveryData.deliveryAddress.street,
        isCompleted: false,
        estimatedTime: 'Today, 6:00 PM'
      }
    ];

    setTrackingEvents(events);
  }, [order]);

  // Simulate live tracking updates
  useEffect(() => {
    if (cancellationStatus === 'cancelled') return;

    const updateTracking = () => {
      const now = new Date();
      
      // Simulate live tracking data when out for delivery
      if (currentStatus === 'Out for Delivery') {
        setLiveTrackingData({
          currentLocation: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01,
            address: '5th Avenue & 42nd Street, New York, NY'
          },
          nextStop: '123 Luxury Lane, Fashion City',
          estimatedArrival: new Date(now.getTime() + 45 * 60 * 1000), // 45 minutes from now
          driverInfo: {
            name: 'Michael Rodriguez',
            phone: '+1 (555) 987-6543',
            vehicleInfo: 'FedEx Truck #4521'
          },
          isLive: true,
          lastUpdated: now
        });
      }

      setLastUpdate(now);
    };

    // Update tracking status progression
    const statusTimeouts = [
      setTimeout(() => {
        setCurrentStatus('Shipped');
        setTrackingEvents(prev => prev.map(event => 
          event.status === 'Shipped' 
            ? { ...event, isCompleted: true, actualTime: new Date().toLocaleString() }
            : event
        ));
      }, 4000),
      
      setTimeout(() => {
        setCurrentStatus('Out for Delivery');
        setTrackingEvents(prev => prev.map(event => 
          event.status === 'Out for Delivery' 
            ? { ...event, isCompleted: true, actualTime: new Date().toLocaleString() }
            : event
        ));
        updateTracking();
      }, 8000),
      
      setTimeout(() => {
        setCurrentStatus('Delivered');
        setTrackingEvents(prev => prev.map(event => 
          event.status === 'Delivered' 
            ? { ...event, isCompleted: true, actualTime: new Date().toLocaleString() }
            : event
        ));
        setLiveTrackingData(null);
      }, 15000)
    ];

    // Live tracking updates every 30 seconds when active
    const liveUpdateInterval = setInterval(updateTracking, 30000);

    return () => {
      statusTimeouts.forEach(clearTimeout);
      clearInterval(liveUpdateInterval);
    };
  }, [currentStatus, cancellationStatus]);

  // Hide navbar effect
  useEffect(() => {
    setShouldHideNavbar(true);
    return () => setShouldHideNavbar(false);
  }, [setShouldHideNavbar]);

  // Event Handlers
  const handleConfirmCancel = () => setCancellationStatus('cancelled');
  const handleCopyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
    }
  };

  const handleRefreshTracking = () => {
    setLastUpdate(new Date());
    // Simulate a small delay for the refresh
    setTimeout(() => {
      if (liveTrackingData) {
        setLiveTrackingData({
          ...liveTrackingData,
          lastUpdated: new Date(),
          estimatedArrival: new Date(Date.now() + Math.random() * 60 * 60 * 1000) // Random ETA within 1 hour
        });
      }
    }, 1000);
  };

  // Render cancellation UI
  const renderCancellationUI = () => {
    if (cancellationStatus === 'cancelled') {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg">
          <p className="font-bold">Order Cancelled</p>
          <p className="text-sm">A refund of <strong>${((order?.total || 0) / 2).toFixed(2)}</strong> has been processed.</p>
        </div>
      );
    }
    
    if (cancellationStatus === 'confirming') {
      return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
          <h3 className="font-bold text-red-800">Confirm Cancellation</h3>
          <p className="text-sm text-red-700">
            A 50% fee applies. You will be refunded <strong>${((order?.total || 0) / 2).toFixed(2)}</strong>.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setCancellationStatus('idle')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Keep Order
            </button>
            <button
              onClick={handleConfirmCancel}
              className="text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => setCancellationStatus('confirming')}
        className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 p-3 rounded-lg transition-colors"
      >
        <XCircle size={20} />
        <span>Cancel Order</span>
      </button>
    );
  };

  // Error state
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <XCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Order Not Found</h1>
          <p className="text-gray-600 mt-2">Please check the link or go back to the homepage.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>Order ID: {order.orderId}</span>
                  <button
                    onClick={handleCopyOrderId}
                    className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                  <span className="ml-4 text-xs">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefreshTracking}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span className="text-sm">Refresh</span>
                </button>
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Shop</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Live Order Tracking */}
              <InfoCard
                icon={<Truck size={24} className="text-indigo-600" />}
                title="Live Order Tracking"
                actions={
                  <div className="flex items-center space-x-2">
                    {liveTrackingData?.isLive && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                }
              >
                <TrackingTimeline
                  events={trackingEvents}
                  currentStatus={currentStatus}
                  isCancelled={cancellationStatus === 'cancelled'}
                  liveData={liveTrackingData || undefined}
                />
              </InfoCard>

              {/* Order Items */}
              <InfoCard
                icon={<Package size={24} className="text-indigo-600" />}
                title={`Items (${order.items.length})`}
              >
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <li key={item.product?.id} className="py-4 flex">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-20 h-20 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
                        <p className="text-sm text-gray-500">
                          Color: {item.color?.name}
                          {item.size ? ` • Size: ${item.size?.name}` : ''}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Delivery Information */}
              {deliveryInfo && (
                <InfoCard
                  icon={<CalendarPlus size={24} className="text-indigo-600" />}
                  title="Delivery Information"
                >
                  <DeliveryInformation
                    deliveryInfo={deliveryInfo}
                    liveData={liveTrackingData || undefined}
                  />
                </InfoCard>
              )}

              {/* Payment Summary */}
              <InfoCard
                icon={<CreditCard size={24} className="text-indigo-600" />}
                title="Payment Summary"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Total Paid</h3>
                    <p className="font-bold text-2xl text-gray-900">${order.total?.toFixed(2)}</p>
                  </div>
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${order.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${order.tax?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Order Management */}
              <InfoCard
                icon={<HelpCircle size={24} className="text-indigo-600" />}
                title="Order Management"
              >
                <div className="space-y-2">
                  {renderCancellationUI()}
                  <button
                    onClick={() => setInvoiceModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                  >
                    <FileText size={20} />
                    <span>View Invoice</span>
                  </button>
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                  >
                    <ShieldCheck size={20} />
                    <span>Returns & Warranty</span>
                  </button>
                </div>
              </InfoCard>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <InvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setInvoiceModalOpen(false)}
            order={order}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderDetails;

