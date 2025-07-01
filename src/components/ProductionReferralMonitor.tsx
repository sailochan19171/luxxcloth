

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useReferral } from "../context/ReferralContext"
import { supabase } from "../lib/supabase"

// Define types for real-time data
interface ActivityChange {
  timestamp: string
  event: string
  data: Record<string, unknown>
}

interface UserChange {
  timestamp: string
  event: string
  data: Record<string, unknown>
}

interface DiscountChange {
  timestamp: string
  event: string
  data: Record<string, unknown>
}

interface RealTimeData {
  lastActivityChange?: ActivityChange
  lastUserChange?: UserChange
  lastDiscountChange?: DiscountChange
  subscriptions?: Array<{
    channel: string
    event: string
    callback: () => void
  }>
}

const ProductionReferralMonitor: React.FC = () => {
  const { state } = useReferral()
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return

    setIsMonitoring(true)
    console.log("🔍 Starting production referral monitoring...")

    // Monitor referral activities
    const activitiesSubscription = supabase
      .channel("referral_activities_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "referral_activities",
        },
        (payload) => {
          console.log("🔄 Referral activity change detected:", payload)
          setRealTimeData((prev: RealTimeData | null) => ({
            ...prev,
            lastActivityChange: {
              timestamp: new Date().toISOString(),
              event: payload.eventType,
              data: payload.new || payload.old,
            },
          }))
        },
      )
      .subscribe()

    // Monitor user updates
    const usersSubscription = supabase
      .channel("referral_users_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "referral_users",
        },
        (payload) => {
          console.log("👤 User change detected:", payload)
          setRealTimeData((prev: RealTimeData | null) => ({
            ...prev,
            lastUserChange: {
              timestamp: new Date().toISOString(),
              event: payload.eventType,
              data: payload.new || payload.old,
            },
          }))
        },
      )
      .subscribe()

    // Monitor discount changes
    const discountsSubscription = supabase
      .channel("referral_discounts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "referral_discounts",
        },
        (payload) => {
          console.log("🎫 Discount change detected:", payload)
          setRealTimeData((prev: RealTimeData | null) => ({
            ...prev,
            lastDiscountChange: {
              timestamp: new Date().toISOString(),
              event: payload.eventType,
              data: payload.new || payload.old,
            },
          }))
        },
      )
      .subscribe()

    // Store subscriptions for cleanup
    setRealTimeData((prev: RealTimeData | null) => ({
      ...prev,
      subscriptions: [activitiesSubscription, usersSubscription, discountsSubscription],
    }))
  }, [isMonitoring])

  const stopMonitoring = useCallback(() => {
    if (realTimeData?.subscriptions) {
      realTimeData.subscriptions.forEach((sub) => {
        supabase.removeChannel(sub)
      })
    }
    setIsMonitoring(false)
    console.log("🛑 Stopped production referral monitoring")
  }, [realTimeData])

  useEffect(() => {
    if (state.environment === "production" && state.currentUser) {
      startMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, [state.currentUser, state.environment, startMonitoring, stopMonitoring])

  if (state.environment !== "production" || !state.currentUser) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm"></h4>
        <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-400" : "bg-red-400"}`} />
      </div>

      <div className="text-xs space-y-2">
        <div>
          <strong>Status:</strong> {isMonitoring ? "Monitoring" : "Stopped"}
        </div>

        {realTimeData?.lastActivityChange && (
          <div>
            <strong>Last Activity:</strong>
            <div className="bg-blue-800 p-1 rounded mt-1">
              {realTimeData.lastActivityChange.event} at{" "}
              {new Date(realTimeData.lastActivityChange.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        {realTimeData?.lastUserChange && (
          <div>
            <strong>Last User Update:</strong>
            <div className="bg-blue-800 p-1 rounded mt-1">
              {realTimeData.lastUserChange.event} at{" "}
              {new Date(realTimeData.lastUserChange.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        {realTimeData?.lastDiscountChange && (
          <div>
            <strong>Last Discount:</strong>
            <div className="bg-blue-800 p-1 rounded mt-1">
              {realTimeData.lastDiscountChange.event} at{" "}
              {new Date(realTimeData.lastDiscountChange.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-blue-700">
          <div>User: {state.currentUser.email?.split("@")[0]}</div>
          <div>Referrals: {state.currentUser.totalReferrals}</div>
          <div>Discounts: {state.discounts.length}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductionReferralMonitor
