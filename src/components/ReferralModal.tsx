

import type React from "react"
import { useState } from "react"
import { X, Copy, Share2, Users, Trophy, Gift, Target, CheckCircle, Crown, Lock } from 'lucide-react'
import { useReferral } from "../context/ReferralContext"
import type { ReferralActivity } from "../context/ReferralContext"

interface ReferralModalProps {
  isOpen: boolean
  onClose: () => void
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const { state, generateReferralLink, redeemCoupon, getTierInfo } = useReferral()
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard" | "activity" | "rewards">("overview")
  const [copySuccess, setCopySuccess] = useState(false)

  if (!isOpen) return null

  if (state.isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    )
  }

  if (!state.currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
          <div className="text-center">
            <Users size={64} className="mx-auto text-purple-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Referral Program</h2>
            <p className="text-gray-600 mb-6">
              Please sign in through the navigation menu to access your referral dashboard
            </p>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Benefits:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>15% discount for you and your friends</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Earn $25 for each successful referral</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Unlock exclusive tier rewards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!state.canAccessReferralDashboard) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
          <div className="text-center">
            <Lock size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Referral Dashboard</h2>
            <p className="text-gray-600 mb-6">
              The referral dashboard is only available to users who have made referrals. Start sharing your referral link to unlock this feature!
            </p>
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Get Access:</h3>
              <ol className="space-y-2 text-sm text-blue-700 text-left">
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Share your referral link with friends</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  <span>When they sign up, you both get 15% off</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Access your dashboard to track progress</span>
                </li>
              </ol>
            </div>
            {state.currentUser && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Your referral link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generateReferralLink()}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateReferralLink())
                      setCopySuccess(true)
                      setTimeout(() => setCopySuccess(false), 2000)
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const referralLink = generateReferralLink()
  const tierInfo = getTierInfo(state.currentUser.tier)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join LUXX - Premium Fashion",
          text: "Get exclusive discounts on luxury fashion! Use my referral link to save on your first order.",
          url: referralLink,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      copyToClipboard(referralLink)
    }
  }

  const getNextTierInfo = () => {
    const tiers: ("bronze" | "silver" | "gold" | "platinum" | "diamond")[] = [
      "bronze",
      "silver",
      "gold",
      "platinum",
      "diamond",
    ]
    const currentIndex = tiers.indexOf(state.currentUser!.tier)
    if (currentIndex < tiers.length - 1) {
      const nextTier = tiers[currentIndex + 1]
      return getTierInfo(nextTier)
    }
    return null
  }

  const nextTier = getNextTierInfo()
  const progressToNext = nextTier
    ? ((state.currentUser.totalReferrals - tierInfo.minReferrals) / (nextTier.minReferrals - tierInfo.minReferrals)) *
      100
    : 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Crown size={24} className="text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Referral Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: "overview" as const, label: "Overview", icon: Target },
            { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
            { id: "activity" as const, label: "Activity", icon: Users },
            { id: "rewards" as const, label: "Rewards", icon: Gift },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? "border-purple-600 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{tierInfo.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{tierInfo.name} Tier</h3>
                      <p className="text-gray-600">{state.currentUser.totalReferrals} successful referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">${state.currentUser.totalEarnings}</p>
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(progressToNext, 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Copy size={16} />
                    <span>{copySuccess ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  Share this link with friends and both of you will earn a{" "}
                  <strong className="text-purple-600">15% off discount</strong>!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{state.currentUser.totalReferrals}</div>
                  <div className="text-green-700 font-medium text-sm">Total Referrals</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{state.discounts.length}</div>
                  <div className="text-blue-700 font-medium text-sm">Active Discounts</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">${state.currentUser.totalEarnings}</div>
                  <div className="text-purple-700 font-medium text-sm">Total Rewards</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Your Referral Activity</h3>
              {state.activities.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No referral activity yet</p>
                  <p className="text-gray-500 text-sm">Start sharing your referral link!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.activities.slice(0, 5).map((activity: ReferralActivity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{activity.referee_email}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(activity.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+${activity.reward_earned}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Available Discounts</h3>
              {state.discounts.length === 0 ? (
                <div className="text-center py-12">
                  <Gift size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No available discounts</p>
                  <p className="text-gray-500 text-sm">Refer friends to earn discounts!</p>
                </div>

              ) : (
                <div className="space-y-3">
                  {state.discounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900">{discount.discount_percentage}% OFF</h4>
                          <p className="text-sm text-gray-600">
                            Expires: {new Date(discount.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => redeemCoupon(discount.id)}
      
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Top Referrers</h3>
              {state.leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No leaderboard data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.leaderboard.slice(0, 5).map((user, index) => {
                    const userTierInfo = getTierInfo(user.tier)
                    const isCurrentUser = user.uid === state.currentUser!.uid
                    return (
                      <div
                        key={user.uid}
                        className={`flex items-center space-x-3 p-4 rounded-lg ${
                          isCurrentUser ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-2xl">{userTierInfo.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {user.displayName} {isCurrentUser && "(You)"}
                          </h4>
                          <p className="text-sm text-gray-600">{user.totalReferrals} referrals</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${user.totalEarnings}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReferralModal
