

import type React from "react"
import { useState } from "react"
import { useReferral } from "../context/ReferralContext"
import { supabase } from "../lib/supabase"

const ReferralDebug: React.FC = () => {
  const { state, refreshUserData } = useReferral()
  const [debugInfo, setDebugInfo] = useState<{
    connectionTest?: { count: number }
    connError?: Error
    userData?: unknown
    userError?: Error
    currentUser?: {
      total_referrals?: number
      total_earnings?: number
      tier?: string
    }
    referrerActivities?: unknown[]
    refError?: Error
    refereeActivities?: unknown[]
    refeeError?: Error
    discounts?: unknown[]
    discError?: Error
    allUsers?: unknown[]
    usersError?: Error
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkReferralData = async () => {
    if (!state.currentUser) return

    setLoading(true)
    try {
      console.log("🔍 Checking referral data for:", state.currentUser.email)

      // Check user data
      const { data: userData, error: userError } = await supabase
        .from("referral_users")
        .select("*")
        .eq("uid", state.currentUser.uid)
        .single()

      // Check activities where this user is the referrer
      const { data: referrerActivities, error: refError } = await supabase
        .from("referral_activities")
        .select("*")
        .eq("referrer_id", state.currentUser.uid)

      // Check activities where this user is the referee
      const { data: refereeActivities, error: refeeError } = await supabase
        .from("referral_activities")
        .select("*")
        .eq("referee_email", state.currentUser.email)

      // Check discounts
      const { data: discounts, error: discError } = await supabase
        .from("referral_discounts")
        .select("*")
        .eq("user_id", state.currentUser.uid)

      // Check all users for referral code validation
      const { data: allUsers, error: usersError } = await supabase
        .from("referral_users")
        .select("uid, email, display_name, referral_code, total_referrals")
        .order("total_referrals", { ascending: false })
        .limit(20)

      // Check database connection
      const { data: connectionTest, error: connError } = await supabase
        .from("referral_users")
        .select("count", { count: "exact", head: true })

      setDebugInfo({
        currentUser: userData,
        userError,
        referrerActivities,
        refError,
        refereeActivities,
        refeeError,
        discounts,
        discError,
        allUsers,
        usersError,
        stateUser: state.currentUser,
        stateActivities: state.activities,
        stateDiscounts: state.discounts,
        stateLeaderboard: state.leaderboard,
        pendingReferralCode: typeof window !== "undefined" ? sessionStorage.getItem("pendingReferralCode") : null,
        environment: state.environment,
        connectionTest,
        connError,
        timestamp: new Date().toISOString(),
      })

      console.log("✅ Debug data collected")
    } catch (error) {
      console.error("Debug error:", error)
      setDebugInfo({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  const forceRefresh = async () => {
    setLoading(true)
    try {
      await refreshUserData()
      console.log("✅ Force refresh completed")
    } catch (error) {
      console.error("❌ Force refresh failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!state.currentUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <p className="text-yellow-800">No user logged in for debugging</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 m-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Referral Debug Info</h3>
        <div className="flex space-x-2">
          <button
            onClick={checkReferralData}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Check Data"}
          </button>
          <button
            onClick={forceRefresh}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Force Refresh"}
          </button>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-800">Environment Info:</h4>
        <p className="text-sm text-blue-700">
          Environment: <strong>{state.environment}</strong>
        </p>
        <p className="text-sm text-blue-700">
          URL: <strong>{typeof window !== "undefined" ? window.location.href : "Server"}</strong>
        </p>
        <p className="text-sm text-blue-700">
          User Agent: <strong>{typeof window !== "undefined" ? navigator.userAgent.slice(0, 100) : "Server"}</strong>
        </p>
      </div>

      {debugInfo && (
        <div className="space-y-4 text-sm">
          {/* Connection Status */}
          <div>
            <h4 className="font-semibold text-gray-700">Database Connection:</h4>
            <div className={`p-2 rounded ${debugInfo.connError ? "bg-red-100" : "bg-green-100"}`}>
              {debugInfo.connError ? (
                <p className="text-red-700">❌ Connection Error: {debugInfo.connError.message}</p>
              ) : (
                <p className="text-green-700">
                  ✅ Connected - Total users: {debugInfo.connectionTest?.count || "Unknown"}
                </p>
              )}
            </div>
          </div>

          {/* State vs Database Comparison */}
          <div>
            <h4 className="font-semibold text-gray-700">State vs Database Comparison:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-600">State Data:</h5>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(
                    {
                      totalReferrals: debugInfo.stateUser?.totalReferrals,
                      totalEarnings: debugInfo.stateUser?.totalEarnings,
                      tier: debugInfo.stateUser?.tier,
                      isReferrer: debugInfo.stateUser?.isReferrer,
                      activitiesCount: debugInfo.stateActivities?.length,
                      discountsCount: debugInfo.stateDiscounts?.length,
                      leaderboardCount: debugInfo.stateLeaderboard?.length,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div>
                <h5 className="font-medium text-gray-600">Database Data:</h5>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(
                    {
                      totalReferrals: debugInfo.currentUser?.total_referrals,
                      totalEarnings: debugInfo.currentUser?.total_earnings,
                      tier: debugInfo.currentUser?.tier,
                      referrerActivitiesCount: debugInfo.referrerActivities?.length,
                      refereeActivitiesCount: debugInfo.refereeActivities?.length,
                      discountsCount: debugInfo.discounts?.length,
                      allUsersCount: debugInfo.allUsers?.length,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>

          {/* Database User */}
          <div>
            <h4 className="font-semibold text-gray-700">Database User:</h4>
            {debugInfo.userError ? (
              <div className="bg-red-100 p-2 rounded">
                <p className="text-red-700">❌ Error: {debugInfo.userError.message}</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.currentUser, null, 2)}
              </pre>
            )}
          </div>

          {/* As Referrer Activities */}
          <div>
            <h4 className="font-semibold text-gray-700">As Referrer (Activities I Created):</h4>
            {debugInfo.refError ? (
              <div className="bg-red-100 p-2 rounded">
                <p className="text-red-700">❌ Error: {debugInfo.refError.message}</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.referrerActivities, null, 2)}
              </pre>
            )}
          </div>

          {/* As Referee Activities */}
          <div>
            <h4 className="font-semibold text-gray-700">As Referee (I was referred):</h4>
            {debugInfo.refeeError ? (
              <div className="bg-red-100 p-2 rounded">
                <p className="text-red-700">❌ Error: {debugInfo.refeeError.message}</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.refereeActivities, null, 2)}
              </pre>
            )}
          </div>

          {/* My Discounts */}
          <div>
            <h4 className="font-semibold text-gray-700">My Discounts:</h4>
            {debugInfo.discError ? (
              <div className="bg-red-100 p-2 rounded">
                <p className="text-red-700">❌ Error: {debugInfo.discError.message}</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.discounts, null, 2)}
              </pre>
            )}
          </div>

          {/* Pending Referral Code */}
          <div>
            <h4 className="font-semibold text-gray-700">Pending Referral Code:</h4>
            <p className="bg-gray-100 p-2 rounded">{debugInfo.pendingReferralCode || "None"}</p>
          </div>

          {/* Top Users */}
          <div>
            <h4 className="font-semibold text-gray-700">Top Users (for validation):</h4>
            {debugInfo.usersError ? (
              <div className="bg-red-100 p-2 rounded">
                <p className="text-red-700">❌ Error: {debugInfo.usersError.message}</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.allUsers, null, 2)}
              </pre>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500">Last checked: {debugInfo.timestamp}</div>
        </div>
      )}
    </div>
  )
}

export default ReferralDebug
