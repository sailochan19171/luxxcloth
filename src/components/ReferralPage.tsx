
import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  Copy, Share2, Trophy, Gift, Users, Crown, Target, CheckCircle, TrendingUp, DollarSign, ArrowUpRight,
  Calendar, RefreshCw, Lock, AlertCircle, Plus, Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useReferral } from "../context/ReferralContext";
import type { ReferralActivity, ReferralDiscount } from "../types";
import ProductionReferralMonitor from "./ProductionReferralMonitor";

// Lazy-load ReferralDebug for performance
const ReferralDebug = lazy(() => import("./ReferralDebug"));

// ErrorBoundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center border border-red-200">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mock tier info (aligned with Collections.tsx)
const getTierInfo = (tier: string) => {
  const tiers: Record<string, { name: string; icon: string; minReferrals: number }> = {
    bronze: { name: "Bronze", icon: "🥉", minReferrals: 0 },
    silver: { name: "Silver", icon: "🥈", minReferrals: 10 },
    gold: { name: "Gold", icon: "🥇", minReferrals: 25 },
    platinum: { name: "Platinum", icon: "💎", minReferrals: 50 },
    diamond: { name: "Diamond", icon: "✨", minReferrals: 100 },
  };
  return tiers[tier] || tiers.bronze;
};

// LeaderboardTrendsChart Component
const LeaderboardTrendsChart: React.FC<{ leaderboard: any[] }> = ({ leaderboard }) => {
  const data = leaderboard.map((user) => ({
    name: user.displayName,
    referrals: user.totalReferrals,
    earnings: user.totalEarnings,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard Trends</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="referrals" stroke="#8884d8" name="Referrals" />
          <Line type="monotone" dataKey="earnings" stroke="#82ca9d" name="Earnings ($)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ReferralPage: React.FC = () => {
  const { state, generateReferralLink, redeemCoupon, getTierInfo, loadAnalytics, refreshUserData } = useReferral();
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard" | "activity" | "rewards" | "analytics">("overview");
  const [copySuccess, setCopySuccess] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  // Initialize analytics when user and dashboard access are available
  useEffect(() => {
    if (state.currentUser && state.canAccessReferralDashboard) {
      const fetchAnalytics = async () => {
        try {
          await loadAnalytics();
          setErrorMessage(null);
        } catch (error) {
          console.error("Failed to load analytics:", error);
          setErrorMessage("Failed to load analytics data. Please try again.");
        }
      };
      fetchAnalytics();
    }
  }, [state.currentUser, state.canAccessReferralDashboard, timeRange]);

  // Auto-refresh in production
  useEffect(() => {
    if (state.environment === "production" && state.currentUser) {
      const interval = setInterval(async () => {
        console.log("🔄 Auto-refreshing referral data...");
        try {
          await refreshUserData();
          setErrorMessage(null);
        } catch (error) {
          console.error("Auto-refresh failed:", error);
          setErrorMessage("Failed to refresh data. Please try manually.");
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [state.environment, state.currentUser]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("🔄 Manual refresh triggered...");
      await refreshUserData();
      setErrorMessage(null);
      if (state.environment === "production") {
        console.log("✅ Production data refreshed successfully");
      }
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      setErrorMessage("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setErrorMessage("Failed to copy referral link.");
    }
  };

  // Share referral link
  const shareReferralLink = async () => {
    const referralLink = generateReferralLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join LUXX - Premium Fashion",
          text: "Get exclusive discounts on luxury fashion! Use my referral link to save on your first order.",
          url: referralLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        setErrorMessage("Failed to share referral link. Copying instead.");
        copyToClipboard(referralLink);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  // Get next tier info
  const getNextTierInfo = () => {
    const tiers: ("bronze" | "silver" | "gold" | "platinum" | "diamond")[] = [
      "bronze",
      "silver",
      "gold",
      "platinum",
      "diamond",
    ];
    const currentIndex = tiers.indexOf(state.currentUser?.tier || "bronze");
    if (currentIndex < tiers.length - 1) {
      return getTierInfo(tiers[currentIndex + 1]);
    }
    return null;
  };

  // Formatters
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Toggle expandable sections
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Loading state
  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your referral dashboard...</p>
          {state.environment === "production" && (
            <p className="text-sm text-gray-500 mt-2">Connecting to production database...</p>
          )}
        </div>
      </div>
    );
  }

  // Access denied state
  if (!state.canAccessReferralDashboard) {
    const referralLink = generateReferralLink();
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <Lock size={64} className="mx-auto text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Referral Dashboard</h1>
              <p className="text-lg text-gray-600 mb-8">
                The referral dashboard is only available to users who have successfully made referrals.
              </p>

              {state.environment === "production" && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-blue-700">Production Environment</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Get Access:</h2>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-blue-900">Share Your Link</h3>
                      <p className="text-sm text-blue-700">Copy and share your unique referral link with friends</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-blue-900">Friends Sign Up</h3>
                      <p className="text-sm text-blue-700">When they sign up using your link, you both get rewards</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-blue-900">Access Dashboard</h3>
                      <p className="text-sm text-blue-700">Track your referrals and earnings in the dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                    aria-label="Your referral link"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    aria-label="Copy referral link"
                  >
                    <Copy size={18} />
                    <span>{copySuccess ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label="Share referral link"
                  >
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  Share this link with friends and both of you will earn a{" "}
                  <strong className="text-purple-600">15% off discount</strong> for each successful referral!
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Benefits</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle size={24} className="text-green-500" />
                    <div className="text-left">
                      <h4 className="font-semibold text-green-900">15% Discount</h4>
                      <p className="text-sm text-green-700">Both you and your friend get 15% off</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <DollarSign size={24} className="text-blue-500" />
                    <div className="text-left">
                      <h4 className="font-semibold text-blue-900">$25 Reward</h4>
                      <p className="text-sm text-blue-700">Earn $25 for each successful referral</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <Trophy size={24} className="text-purple-500" />
                    <div className="text-left">
                      <h4 className="font-semibold text-purple-900">Tier Rewards</h4>
                      <p className="text-sm text-purple-700">Unlock exclusive benefits as you refer more</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                    <Crown size={24} className="text-orange-500" />
                    <div className="text-left">
                      <h4 className="font-semibold text-orange-900">VIP Status</h4>
                      <p className="text-sm text-orange-700">Get priority access to new collections</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {state.environment === "production" && <ProductionReferralMonitor />}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const referralLink = generateReferralLink();
  const tierInfo = getTierInfo(state.currentUser.tier);
  const nextTier = getNextTierInfo();
  const progressToNext = nextTier
    ? ((state.currentUser.totalReferrals - tierInfo.minReferrals) / (nextTier.minReferrals - tierInfo.minReferrals)) * 100
    : 100;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          <AnimatePresence>
            {(errorMessage || state.error) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle size={20} className="text-blue-600" />
                  <p className="text-blue-800 text-sm">{errorMessage || state.error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Crown size={40} />
                <div>
                  <h1 className="text-3xl font-bold">Welcome, {state.currentUser.displayName}!</h1>
                  <p className="text-purple-100 text-lg">Your Referral Dashboard</p>
                  <p className="text-purple-200 text-sm">Code: {state.currentUser.referralCode}</p>
                  {state.environment === "production" && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-purple-200 text-xs">Production Mode</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                  aria-label="Refresh referral data"
                >
                  <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
                  <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Development Tools */}
          {state.environment === "development" && (
            <Suspense fallback={<div className="text-center text-gray-600">Loading dev tools...</div>}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">🧪 Development Tools</h3>
                <p className="text-green-700 mb-3">
                  Your referral link: <code className="bg-green-100 px-2 py-1 rounded">{referralLink}</code>
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const testUrl = `${window.location.origin}?ref=${state.currentUser?.referralCode}`;
                      window.open(testUrl, "_blank");
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    aria-label="Test referral link"
                  >
                    🔗 Test Referral Link
                  </button>
                  <button
                    onClick={() => {
                      const testUrl = `${window.location.origin}/collections?ref=${state.currentUser?.referralCode}`;
                      window.open(testUrl, "_blank");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label="Test collections page with referral"
                  >
                    🛍️ Test Collections Page
                  </button>
                </div>
                <ReferralDebug />
              </motion.div>
            </Suspense>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: "overview" as const, label: "Overview", icon: Target },
                { id: "analytics" as const, label: "Analytics", icon: TrendingUp },
                { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
                { id: "activity" as const, label: "Activity", icon: Users },
                { id: "rewards" as const, label: "Rewards", icon: Gift },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === id
                      ? "border-purple-600 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={`Switch to ${label} tab`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence>
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Total Referrals</p>
                            <p className="text-3xl font-bold text-blue-900">
                              {state.analytics?.totalReferrals ?? state.currentUser.totalReferrals}
                            </p>
                          </div>
                          <Users className="text-blue-600" size={32} />
                        </div>
                        <div className="flex items-center mt-3">
                          <ArrowUpRight size={16} className="text-green-500" />
                          <span className="text-green-500 text-sm ml-1">Active referrals</span>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">Conversions</p>
                            <p className="text-3xl font-bold text-green-900">{state.analytics?.totalConversions ?? 0}</p>
                          </div>
                          <Target className="text-green-600" size={32} />
                        </div>
                        <div className="flex items-center mt-3">
                          <ArrowUpRight size={16} className="text-green-500" />
                          <span className="text-green-500 text-sm ml-1">
                            {formatPercentage(state.analytics?.conversionRate ?? 0)} conversion rate
                          </span>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-purple-900">
                              {formatCurrency(state.analytics?.totalRevenue ?? 0)}
                            </p>
                          </div>
                          <DollarSign className="text-purple-600" size={32} />
                        </div>
                        <div className="flex items-center mt-3">
                          <ArrowUpRight size={16} className="text-green-500" />
                          <span className="text-green-500 text-sm ml-1">From referrals</span>
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">Your Earnings</p>
                            <p className="text-3xl font-bold text-orange-900">
                              {formatCurrency(state.currentUser.totalEarnings)}
                            </p>
                          </div>
                          <Crown className="text-orange-600" size={32} />
                        </div>
                        <div className="flex items-center mt-3">
                          <ArrowUpRight size={16} className="text-green-500" />
                          <span className="text-green-500 text-sm ml-1">Referral rewards</span>
                        </div>
                      </div>
                    </div>

                    {/* User Tier Status */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <span className="text-4xl">{tierInfo.icon}</span>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{tierInfo.name} Tier</h3>
                            <p className="text-gray-600">{state.currentUser.totalReferrals} successful referrals</p>
                            <p className="text-sm text-gray-500">
                              {formatPercentage(state.currentUser.conversionRate)} conversion rate •{" "}
                              {state.currentUser.totalPurchases} purchases
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-600">${state.currentUser.totalEarnings}</p>
                          <p className="text-sm text-gray-600">Total Earned</p>
                        </div>
                      </div>
                      {nextTier && (
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress to {nextTier.name}</span>
                            <span>
                              {state.currentUser.totalReferrals}/{nextTier.minReferrals}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(Math.max(progressToNext, 0), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Referral Link Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Link</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                          aria-label="Your referral link"
                        />
                        <button
                          onClick={() => copyToClipboard(referralLink)}
                          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          aria-label="Copy referral link"
                        >
                          <Copy size={18} />
                          <span>{copySuccess ? "Copied!" : "Copy"}</span>
                        </button>
                        <button
                          onClick={shareReferralLink}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          aria-label="Share referral link"
                        >
                          <Share2 size={18} />
                          <span>Share</span>
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Share this link with friends and both of you will earn a{" "}
                        <strong className="text-purple-600">15% off discount</strong> for each successful referral!
                      </p>
                    </div>

                    {/* Performance Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <button
                          onClick={() => toggleSection("performance")}
                          className="flex items-center justify-between w-full text-left mb-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
                          {expandedSections.has("performance") ? <Minus size={16} /> : <Plus size={16} />}
                        </button>
                        <AnimatePresence>
                          {expandedSections.has("performance") && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Referrals</span>
                                <span className="font-semibold">{state.currentUser.totalReferrals}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Discounts</span>
                                <span className="font-semibold">{state.discounts.length}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Earnings</span>
                                <span className="font-semibold">{formatCurrency(state.currentUser.totalEarnings)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Conversion Rate</span>
                                <span className="font-semibold">{formatPercentage(state.currentUser.conversionRate)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Purchases</span>
                                <span className="font-semibold">{state.currentUser.totalPurchases}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <button
                          onClick={() => toggleSection("recentActivity")}
                          className="flex items-center justify-between w-full text-left mb-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                          {expandedSections.has("recentActivity") ? <Minus size={16} /> : <Plus size={16} />}
                        </button>
                        <AnimatePresence>
                          {expandedSections.has("recentActivity") && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-3"
                            >
                              {state.activities.slice(0, 5).map((activity: ReferralActivity) => (
                                <div key={activity.id} className="flex items-center justify-between py-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Users size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{activity.referee_email}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(activity.joined_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-green-600">
                                      +{formatCurrency(activity.reward_earned)}
                                    </p>
                                    {activity.total_purchases > 0 && (
                                      <p className="text-xs text-gray-500">{activity.total_purchases} purchases</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {state.activities.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No referral activity yet</p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Analytics</h3>
                      <div className="flex items-center space-x-2">
                        <Calendar size={20} className="text-gray-500" />
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "90d" | "1y")}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          aria-label="Select time range for analytics"
                        >
                          <option value="7d">Last 7 days</option>
                          <option value="30d">Last 30 days</option>
                          <option value="90d">Last 90 days</option>
                          <option value="1y">Last year</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Funnel</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Link Clicks</span>
                            <span className="font-semibold">{state.analytics?.linkClicks ?? "--"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sign-ups</span>
                            <span className="font-semibold">{state.currentUser.totalReferrals}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">First Purchase</span>
                            <span className="font-semibold">{state.analytics?.totalConversions ?? 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Conversion Rate</span>
                            <span className="font-semibold text-green-600">
                              {formatPercentage(state.currentUser.conversionRate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue From Your Referrals</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-semibold">{formatCurrency(state.analytics?.totalRevenue ?? 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Avg Order Value</span>
                            <span className="font-semibold">{formatCurrency(state.analytics?.averageOrderValue ?? 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Your Earnings</span>
                            <span className="font-semibold text-purple-600">
                              {formatCurrency(state.currentUser.totalEarnings)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Commission Rate</span>
                            <span className="font-semibold">5%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Active Referrals</span>
                            <span className="font-semibold">{state.analytics?.activeReferrals ?? 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Repeat Customers</span>
                            <span className="font-semibold">
                              {state.activities.filter((a) => a.total_purchases > 1).length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Avg Time to Purchase</span>
                            <span className="font-semibold">{state.analytics?.avgTimeToPurchase ?? "3.2 days"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Customer Lifetime Value</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                (state.analytics?.totalRevenue ?? 0) / Math.max(state.analytics?.totalConversions ?? 1, 1),
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <LeaderboardTrendsChart leaderboard={state.leaderboard} />
                  </motion.div>
                )}

                {activeTab === "leaderboard" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">Top Referrers</h3>
                    {state.leaderboard.length === 0 ? (
                      <div className="text-center py-16">
                        <Trophy size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-2">No leaderboard data yet</p>
                        <p className="text-gray-500 text-sm">Be the first to start referring friends!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {state.leaderboard.map((user, index: number) => {
                          const userTierInfo = getTierInfo(user.tier);
                          const isCurrentUser = user.uid === state.currentUser!.uid;
                          return (
                            <motion.div
                              key={user.uid}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={`flex items-center space-x-4 p-6 rounded-xl transition-all ${
                                isCurrentUser ? "bg-purple-50 border-2 border-purple-200" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-lg font-bold">
                                {index + 1}
                              </div>
                              <span className="text-3xl">{userTierInfo.icon}</span>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {user.displayName} {isCurrentUser && "(You)"}
                                </h4>
                                <p className="text-gray-600 text-sm">{userTierInfo.name}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">{user.totalReferrals} referrals</div>
                                <div className="text-gray-600 text-sm">{formatCurrency(user.totalEarnings)} earned</div>
                              </div>
                            </motion.div>
                          );
                        })}
                        <LeaderboardTrendsChart leaderboard={state.leaderboard} />
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">Your Referral Activity</h3>
                    {state.activities.length === 0 ? (
                      <div className="text-center py-16">
                        <Users size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-2">No referral activity yet</p>
                        <p className="text-gray-500 text-sm">Start sharing your referral link to see activity here!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {state.activities.map((activity: ReferralActivity) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-6 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center space-x-4">
                              <CheckCircle size={24} className="text-green-500" />
                              <div>
                                <p className="text-lg font-medium text-gray-900">{activity.referee_email}</p>
                                <p className="text-gray-600 text-sm">
                                  Joined on {new Date(activity.joined_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">+{formatCurrency(activity.reward_earned)}</div>
                              <div className="text-gray-600 text-sm">Reward</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "rewards" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Discounts</h3>
                      {state.discounts.length === 0 ? (
                        <div className="text-center py-16">
                          <Gift size={64} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-xl text-gray-600 mb-2">No available discounts</p>
                          <p className="text-gray-500 text-sm">Refer friends to earn discounts!</p>
                        </div>
                      ) : (
                        <div className="grid gap-6">
                          {state.discounts.map((discount: ReferralDiscount) => (
                            <motion.div
                              key={discount.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {discount.discount_percentage}% OFF Discount
                                  </h4>
                                  <p className="text-purple-600 font-semibold text-lg mb-1">
                                    Save {discount.discount_percentage}% on your next purchase
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    Expires: {discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : "No expiration"}
                                  </p>
                                </div>
                                <div className="flex space-x-3">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await redeemCoupon(discount.id);
                                        setErrorMessage(null);
                                      } catch (error) {
                                        console.error("Failed to redeem coupon:", error);
                                        setErrorMessage("Failed to redeem discount. Please try again.");
                                      }
                                    }}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    aria-label={`Redeem ${discount.discount_percentage}% off discount`}
                                  >
                                    Use Discount
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {state.environment === "production" && <ProductionReferralMonitor />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ReferralPage;
