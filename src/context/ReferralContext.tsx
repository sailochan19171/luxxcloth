import type React from "react"
import { createContext, useReducer, useEffect, useContext } from "react"
import { User as FirebaseUser } from "firebase/auth"
import { supabase } from "../lib/supabase"

export interface ReferralUser {
  uid: string
  email: string
  displayName: string
  joinedAt: string
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  totalReferrals: number
  totalEarnings: number
  referralCode: string
  coupons: Coupon[]
  totalPurchases: number
  conversionRate: number
  isReferrer: boolean
  referredBy?: string
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  expiresAt: string
}

export interface ReferralDiscount {
  id: string
  user_id: string
  discount_percentage: number
  type: "referrer" | "referred"
  is_active: boolean
  expires_at?: string
  used?: boolean
  applied_at?: string
  referred_by: string
  created_at?: string
}

export interface ReferralActivity {
  id: string
  referrer_id: string
  referee_email: string
  referee_id?: string
  joined_at: string
  status: "pending" | "completed"
  reward_earned: number
  first_purchase_at?: string
  total_purchases: number
  total_spent: number
}

export interface ReferralPurchase {
  id: string
  user_id: string
  referrer_id?: string
  product_id: string
  product_name: string
  amount: number
  discount_used?: number
  purchase_date: string
  referral_activity_id?: string
}

export interface ReferralAnalytics {
  totalReferrals: number
  activeReferrals: number
  totalConversions: number
  totalRevenue: number
  conversionRate: number
  averageOrderValue: number
  topReferrers: ReferralUser[]
  recentActivity: ReferralActivity[]
  monthlyStats: {
    month: string
    referrals: number
    conversions: number
    revenue: number
  }[]
}

export interface ReferralState {
  currentUser: ReferralUser | null
  referralCode: string
  activities: ReferralActivity[]
  discounts: ReferralDiscount[]
  purchases: ReferralPurchase[]
  analytics: ReferralAnalytics | null
  leaderboard: ReferralUser[]
  isLoading: boolean
  error: string | null
  pendingReferralCode: string | null
  isAuthenticated: boolean
  canAccessReferralDashboard: boolean
  environment: "development" | "production"
}

export interface ReferralContextType {
  state: ReferralState
  generateReferralLink: () => string
  trackReferral: (refereeEmail: string, referralCode?: string) => Promise<void>
  trackPurchase: (productId: string, productName: string, amount: number, discountUsed?: number) => Promise<void>
  redeemDiscount: (discountId: string) => Promise<void>
  validateReferralCode: (code: string) => Promise<boolean>
  getTierInfo: (tier: ReferralUser["tier"]) => { name: string; icon: string; minReferrals: number }
  redeemCoupon: (discountId: string) => Promise<void>
  initializeUserFromFirebase: (firebaseUser: FirebaseUser) => Promise<void>
  loadAnalytics: () => Promise<void>
  processReferralFromUrl: () => Promise<string | null>
  refreshUserData: () => Promise<void>
}

type ReferralAction =
  | { type: "SET_USER"; payload: ReferralUser | null }
  | { type: "SET_ACTIVITIES"; payload: ReferralActivity[] }
  | { type: "SET_DISCOUNTS"; payload: ReferralDiscount[] }
  | { type: "SET_PURCHASES"; payload: ReferralPurchase[] }
  | { type: "SET_ANALYTICS"; payload: ReferralAnalytics }
  | { type: "SET_LEADERBOARD"; payload: ReferralUser[] }
  | { type: "ADD_ACTIVITY"; payload: ReferralActivity }
  | { type: "ADD_PURCHASE"; payload: ReferralPurchase }
  | { type: "UPDATE_USER"; payload: Partial<ReferralUser> }
  | { type: "UPDATE_DISCOUNT"; payload: ReferralDiscount }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PENDING_REFERRAL_CODE"; payload: string | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_DASHBOARD_ACCESS"; payload: boolean }
  | { type: "SET_ENVIRONMENT"; payload: "development" | "production" }

const initialState: ReferralState = {
  currentUser: null,
  referralCode: "",
  activities: [],
  discounts: [],
  purchases: [],
  analytics: null,
  leaderboard: [],
  isLoading: false,
  error: null,
  pendingReferralCode: null,
  isAuthenticated: false,
  canAccessReferralDashboard: false,
  environment:
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "development"
      : "production",
}

export const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

function referralReducer(state: ReferralState, action: ReferralAction): ReferralState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        currentUser: action.payload,
        referralCode: action.payload?.referralCode || "",
        isAuthenticated: !!action.payload,
        canAccessReferralDashboard: action.payload?.isReferrer || false,
      }
    case "SET_ACTIVITIES":
      return { ...state, activities: action.payload }
    case "SET_DISCOUNTS":
      return { ...state, discounts: action.payload }
    case "SET_PURCHASES":
      return { ...state, purchases: action.payload }
    case "SET_ANALYTICS":
      return { ...state, analytics: action.payload }
    case "SET_LEADERBOARD":
      return { ...state, leaderboard: action.payload }
    case "ADD_ACTIVITY":
      return { ...state, activities: [action.payload, ...state.activities] }
    case "ADD_PURCHASE":
      return { ...state, purchases: [action.payload, ...state.purchases] }
    case "UPDATE_USER": {
      const updatedUser = state.currentUser ? { ...state.currentUser, ...action.payload } : null
      return {
        ...state,
        currentUser: updatedUser,
        referralCode: action.payload.referralCode || state.referralCode,
        canAccessReferralDashboard: updatedUser?.isReferrer || false,
      }
    }
    case "UPDATE_DISCOUNT":
      return {
        ...state,
        discounts: state.discounts.map((d) => (d.id === action.payload.id ? action.payload : d)),
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_PENDING_REFERRAL_CODE":
      return { ...state, pendingReferralCode: action.payload }
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload }
    case "SET_DASHBOARD_ACCESS":
      return { ...state, canAccessReferralDashboard: action.payload }
    case "SET_ENVIRONMENT":
      return { ...state, environment: action.payload }
    default:
      return state
  }
}

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(referralReducer, initialState)

  const generateUserReferralCode = (uid: string): string => {
    const timestamp = Date.now().toString().slice(-4)
    const baseCode = btoa(uid + timestamp)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase()

    return baseCode + timestamp.slice(-2)
  }

  const processReferralFromUrl = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location : null
    if (!currentUrl) return null

    const urlParams = new URLSearchParams(currentUrl.search)
    const referralCode = urlParams.get("ref")

    if (referralCode) {
      console.log("🔗 Found referral code in URL:", referralCode)
      console.log("🌐 Current environment:", state.environment)
      console.log("🌐 Current URL:", currentUrl.href)

      const { data: referrer, error } = await supabase
        .from("referral_users")
        .select("uid, display_name, email")
        .eq("referral_code", referralCode)
        .single()

      if (error || !referrer) {
        console.error("❌ Invalid referral code:", referralCode, error)
        dispatch({
          type: "SET_ERROR",
          payload: "Invalid referral link. Please check the link and try again.",
        })
        return null
      }

      console.log("✅ Valid referral code from:", referrer.display_name, referrer.email)
      dispatch({ type: "SET_PENDING_REFERRAL_CODE", payload: referralCode })

      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingReferralCode", referralCode)
        sessionStorage.setItem("referrerInfo", JSON.stringify(referrer))

        // Clean URL for both localhost and production
        const newUrl = currentUrl.pathname
        window.history.replaceState({}, document.title, newUrl)
      }

      dispatch({
        type: "SET_ERROR",
        payload: `🎉 Referral from ${referrer.display_name} detected! Sign in or sign up to get your 15% discount.`,
      })

      return referralCode
    }

    return null
  }

  const checkIfUserIsReferrer = async (userId: string): Promise<boolean> => {
    try {
      const { data: referrals, error } = await supabase
        .from("referral_activities")
        .select("id")
        .eq("referrer_id", userId)
        .limit(1)

      if (error) {
        console.error("Error checking referrer status:", error)
        return false
      }

      return (referrals && referrals.length > 0) || false
    } catch (error) {
      console.error("Error checking referrer status:", error)
      return false
    }
  }

  const checkIfUserWasReferred = async (userEmail: string): Promise<string | null> => {
    try {
      const { data: referralActivity, error } = await supabase
        .from("referral_activities")
        .select("referrer_id")
        .eq("referee_email", userEmail)
        .single()

      if (error || !referralActivity) {
        return null
      }

      return referralActivity.referrer_id
    } catch (error) {
      console.error("Error checking if user was referred:", error)
      return null
    }
  }

  const initializeUserFromFirebase = async (firebaseUser: FirebaseUser) => {
    if (!firebaseUser) {
      dispatch({ type: "SET_USER", payload: null })
      dispatch({ type: "SET_ACTIVITIES", payload: [] })
      dispatch({ type: "SET_DISCOUNTS", payload: [] })
      dispatch({ type: "SET_PURCHASES", payload: [] })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      console.log("🔄 Initializing user from Firebase:", firebaseUser.email)
      console.log("🌐 Environment:", state.environment)
      console.log("🌐 Current URL:", typeof window !== "undefined" ? window.location.href : "server")

      // Add retry logic for production
      const maxRetries = state.environment === "production" ? 3 : 1
      let retryCount = 0

      while (retryCount < maxRetries) {
        try {
          const referralCode = generateUserReferralCode(firebaseUser.uid)

          const { data: existingUser, error: fetchError } = await supabase
            .from("referral_users")
            .select("*")
            .eq("uid", firebaseUser.uid)
            .single()

          let referralUser: ReferralUser | null = null
          let isNewUser = false

          if (existingUser && !fetchError) {
            console.log("👤 Found existing user in database")

            const isReferrer = await checkIfUserIsReferrer(existingUser.uid)
            const referredBy = await checkIfUserWasReferred(existingUser.email)

            referralUser = {
              uid: existingUser.uid,
              email: existingUser.email,
              displayName: existingUser.display_name || existingUser.displayName,
              joinedAt: existingUser.joined_at || existingUser.joinedAt,
              tier: existingUser.tier,
              totalReferrals: existingUser.total_referrals || 0,
              totalEarnings: existingUser.total_earnings || 0,
              referralCode: existingUser.referral_code || referralCode,
              coupons: [],
              totalPurchases: existingUser.total_purchases || 0,
              conversionRate: existingUser.conversion_rate || 0,
              isReferrer: isReferrer,
              referredBy: referredBy || undefined,
            }
          } else {
            console.log("🆕 Creating new user in database")
            isNewUser = true

            let referralCode = generateUserReferralCode(firebaseUser.uid)
            let attempts = 0
            const maxAttempts = 5

            const referredBy = await checkIfUserWasReferred(firebaseUser.email || "")

            while (attempts < maxAttempts) {
              try {
                referralUser = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                  joinedAt: new Date().toISOString(),
                  tier: "bronze",
                  totalReferrals: 0,
                  totalEarnings: 0,
                  referralCode,
                  coupons: [],
                  totalPurchases: 0,
                  conversionRate: 0,
                  isReferrer: false,
                  referredBy: referredBy || undefined,
                }

                const { error: insertError } = await supabase.from("referral_users").insert({
                  uid: referralUser.uid,
                  email: referralUser.email,
                  display_name: referralUser.displayName,
                  joined_at: referralUser.joinedAt,
                  tier: referralUser.tier,
                  total_referrals: referralUser.totalReferrals,
                  total_earnings: referralUser.totalEarnings,
                  referral_code: referralUser.referralCode,
                  total_purchases: referralUser.totalPurchases,
                  conversion_rate: referralUser.conversionRate,
                })

                if (insertError && insertError.code === "23505") {
                  attempts++
                  referralCode = generateUserReferralCode(firebaseUser.uid + attempts)
                  console.log(`🔄 Duplicate referral code, trying again (${attempts}/${maxAttempts}):`, referralCode)
                  continue
                } else if (insertError) {
                  console.error("❌ Error creating user:", insertError)
                  throw insertError
                } else {
                  console.log("✅ Created new user:", referralUser.email)
                  break
                }
              } catch (error) {
                console.error("❌ Unexpected error creating user:", error)
                throw error
              }
            }

            if (attempts >= maxAttempts) {
              throw new Error("Failed to create user after maximum attempts")
            }
          }

          if (!referralUser) {
            throw new Error("Failed to create or load user")
          }

          dispatch({ type: "SET_USER", payload: referralUser })

          // Load user data with proper sequencing
          if (referralUser.isReferrer) {
            await Promise.all([loadUserData(firebaseUser.uid), loadLeaderboard(), loadAnalytics()])
          }

          // Process pending referral for ALL users (new and existing)
          const pendingCode =
            state.pendingReferralCode ||
            (typeof window !== "undefined" ? sessionStorage.getItem("pendingReferralCode") : null)

          if (pendingCode && firebaseUser.email) {
            console.log("🎯 Processing pending referral:", {
              email: firebaseUser.email,
              code: pendingCode,
              isNewUser,
              environment: state.environment,
            })

            // Check if this specific email has already been referred
            const { data: existingReferral } = await supabase
              .from("referral_activities")
              .select("id, referrer_id")
              .eq("referee_email", firebaseUser.email)
              .single()

            if (!existingReferral) {
              console.log("✅ No existing referral found, processing new referral")
              // Process the referral for any user who hasn't been referred before
              await trackReferral(firebaseUser.email, pendingCode)

              // Load discounts for the NEW USER (referee) after referral processing
              console.log("🎫 Loading discounts for the new referee...")

              // Use longer delay in production for data consistency
              const delay = state.environment === "production" ? 3000 : 2000
              setTimeout(async () => {
                await loadUserDiscounts(firebaseUser.uid)
                await refreshUserData() // Force refresh in production
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("pendingReferralCode")
                  sessionStorage.removeItem("referrerInfo")
                }
                dispatch({ type: "SET_PENDING_REFERRAL_CODE", payload: null })
              }, delay)
            } else {
              console.log("⚠️ User has already been referred before")
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("pendingReferralCode")
                sessionStorage.removeItem("referrerInfo")
              }
              dispatch({ type: "SET_PENDING_REFERRAL_CODE", payload: null })
              dispatch({
                type: "SET_ERROR",
                payload: "You have already used a referral link before!",
              })
            }
          } else {
            // Load existing discounts for returning users
            await loadUserDiscounts(firebaseUser.uid)
          }

          // Success - break out of retry loop
          break
        } catch (error) {
          retryCount++
          console.error(`❌ Error initializing user (attempt ${retryCount}/${maxRetries}):`, error)

          if (retryCount >= maxRetries) {
            throw error
          }

          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
        }
      }
    } catch (error) {
      console.error("❌ Error initializing user from Firebase:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to initialize referral data. Please refresh the page." })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loadUserData = async (userId: string) => {
    try {
      console.log("📊 Loading user data for:", userId)

      const { data: activities, error: activitiesError } = await supabase
        .from("referral_activities")
        .select("*")
        .eq("referrer_id", userId)
        .order("joined_at", { ascending: false })

      if (!activitiesError && activities) {
        console.log("📈 Loaded activities:", activities.length)
        dispatch({ type: "SET_ACTIVITIES", payload: activities })
      } else {
        console.error("❌ Error loading activities:", activitiesError)
        dispatch({ type: "SET_ACTIVITIES", payload: [] })
      }

      const { data: discounts, error: discountsError } = await supabase
        .from("referral_discounts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())

      if (!discountsError && discounts) {
        console.log("🎫 Loaded discounts:", discounts.length)
        dispatch({ type: "SET_DISCOUNTS", payload: discounts })
      } else {
        console.error("❌ Error loading discounts:", discountsError)
        dispatch({ type: "SET_DISCOUNTS", payload: [] })
      }

      const { data: purchases, error: purchasesError } = await supabase
        .from("referral_purchases")
        .select("*")
        .eq("referrer_id", userId)
        .order("purchase_date", { ascending: false })

      if (!purchasesError && purchases) {
        console.log("🛒 Loaded purchases:", purchases.length)
        dispatch({ type: "SET_PURCHASES", payload: purchases })
      } else {
        console.error("❌ Error loading purchases:", purchasesError)
        dispatch({ type: "SET_PURCHASES", payload: [] })
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error)
    }
  }

  const loadUserDiscounts = async (userId: string) => {
    try {
      console.log("🎫 Loading discounts for user:", userId)

      const { data: discounts, error: discountsError } = await supabase
        .from("referral_discounts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())

      if (!discountsError && discounts) {
        console.log("✅ Loaded discounts for user:", discounts.length, discounts)
        dispatch({ type: "SET_DISCOUNTS", payload: discounts })

        if (discounts.length > 0) {
          dispatch({
            type: "SET_ERROR",
            payload: `🎉 You have ${discounts.length} active discount(s)! ${discounts[0].discount_percentage}% off all items.`,
          })
        }
      } else {
        console.error("❌ Error loading discounts:", discountsError)
        dispatch({ type: "SET_DISCOUNTS", payload: [] })
      }
    } catch (error) {
      console.error("❌ Error loading user discounts:", error)
      dispatch({ type: "SET_DISCOUNTS", payload: [] })
    }
  }

  const refreshUserData = async () => {
    if (state.currentUser) {
      console.log("🔄 Refreshing user data...")

      try {
        // Force fresh data fetch from database
        const { data: userData, error: userError } = await supabase
          .from("referral_users")
          .select("*")
          .eq("uid", state.currentUser.uid)
          .single()

        if (!userError && userData) {
          const isReferrer = await checkIfUserIsReferrer(state.currentUser.uid)

          dispatch({
            type: "UPDATE_USER",
            payload: {
              totalReferrals: userData.total_referrals || 0,
              totalEarnings: userData.total_earnings || 0,
              tier: userData.tier,
              conversionRate: userData.conversion_rate || 0,
              totalPurchases: userData.total_purchases || 0,
              isReferrer,
            },
          })

          if (isReferrer) {
            await Promise.all([loadUserData(state.currentUser.uid), loadLeaderboard(), loadAnalytics()])
          }

          // Always reload discounts
          await loadUserDiscounts(state.currentUser.uid)
        }
      } catch (error) {
        console.error("❌ Error refreshing user data:", error)
      }
    }
  }

  const loadLeaderboard = async () => {
    try {
      console.log("🏆 Loading leaderboard...")

      const { data: leaderboardData, error } = await supabase
        .from("referral_users")
        .select("*")
        .gt("total_referrals", 0)
        .order("total_referrals", { ascending: false })
        .limit(10)

      if (!error && leaderboardData) {
        const leaderboard = leaderboardData.map((user) => ({
          uid: user.uid,
          email: user.email,
          displayName: user.display_name || user.displayName,
          joinedAt: user.joined_at || user.joinedAt,
          tier: user.tier,
          totalReferrals: user.total_referrals || 0,
          totalEarnings: user.total_earnings || 0,
          referralCode: user.referral_code || user.referralCode,
          coupons: [],
          totalPurchases: user.total_purchases || 0,
          conversionRate: user.conversion_rate || 0,
          isReferrer: true,
        }))

        console.log("✅ Loaded leaderboard:", leaderboard.length, "users")
        dispatch({ type: "SET_LEADERBOARD", payload: leaderboard })
      } else {
        console.error("❌ Error loading leaderboard:", error)
      }
    } catch (error) {
      console.error("❌ Error loading leaderboard:", error)
    }
  }

  const loadAnalytics = async () => {
    if (!state.currentUser || !state.canAccessReferralDashboard) return

    try {
      const { data: userActivities } = await supabase
        .from("referral_activities")
        .select("*")
        .eq("referrer_id", state.currentUser.uid)

      const { data: userPurchases } = await supabase
        .from("referral_purchases")
        .select("*")
        .eq("referrer_id", state.currentUser.uid)

      const totalReferrals = userActivities?.length || 0
      const totalConversions = userActivities?.filter((a) => a.first_purchase_at).length || 0
      const totalRevenue = userPurchases?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0
      const conversionRate = totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0
      const averageOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0

      const analytics: ReferralAnalytics = {
        totalReferrals,
        activeReferrals: totalReferrals - totalConversions,
        totalConversions,
        totalRevenue,
        conversionRate,
        averageOrderValue,
        topReferrers: state.leaderboard.slice(0, 5),
        recentActivity: userActivities || [],
        monthlyStats: [],
      }

      dispatch({ type: "SET_ANALYTICS", payload: analytics })
    } catch (error) {
      console.error("❌ Error loading analytics:", error)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        // Set environment
        const env =
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "development"
            : "production"
        dispatch({ type: "SET_ENVIRONMENT", payload: env })

        await processReferralFromUrl()
      } catch (error) {
        console.error("❌ Auth initialization error:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to initialize authentication" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeAuth()
  }, []) // Remove processReferralFromUrl from dependencies to prevent infinite loop

  const generateReferralLink = (): string => {
    if (!state.currentUser) {
      return typeof window !== "undefined" ? window.location.origin : "https://luxxcloth.web.app"
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://luxxcloth.web.app"
    return `${baseUrl}?ref=${state.currentUser.referralCode}`
  }

  const validateReferralCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("referral_users").select("uid").eq("referral_code", code).single()
      return !error && !!data
    } catch (error) {
      console.error("❌ Error validating referral code:", error)
      return false
    }
  }

  const trackReferral = async (refereeEmail: string, referralCode?: string): Promise<void> => {
    if (!referralCode) {
      console.error("❌ No referral code provided")
      return
    }

    try {
      console.log("🎯 Processing referral:", { refereeEmail, referralCode, environment: state.environment })

      // Add transaction-like behavior for production
      const { data: referrer, error: referrerError } = await supabase
        .from("referral_users")
        .select("*")
        .eq("referral_code", referralCode)
        .single()

      if (referrerError || !referrer) {
        console.error("❌ Invalid referral code:", referrerError)
        dispatch({ type: "SET_ERROR", payload: "Invalid referral code" })
        return
      }

      console.log("✅ Found referrer:", referrer.display_name, referrer.email)

      if (state.currentUser && referrer.uid === state.currentUser.uid) {
        console.error("❌ Self-referral attempt")
        dispatch({ type: "SET_ERROR", payload: "You cannot refer yourself!" })
        return
      }

      // Double-check for existing referral to prevent duplicates
      const { data: existingReferral } = await supabase
        .from("referral_activities")
        .select("id, referrer_id")
        .eq("referee_email", refereeEmail)
        .single()

      if (existingReferral) {
        console.log("⚠️ Referral already exists for this email")
        dispatch({ type: "SET_ERROR", payload: "This email has already been referred!" })
        return
      }

      const currentUserUid = state.currentUser?.uid || null

      // Create referral activity with better error handling
      console.log("📝 Creating referral activity...")
      const { data: activityData, error: activityError } = await supabase
        .from("referral_activities")
        .insert([
          {
            referrer_id: referrer.uid,
            referee_id: currentUserUid,
            referee_email: refereeEmail,
            joined_at: new Date().toISOString(),
            status: "completed",
            reward_earned: 25,
            total_purchases: 0,
            total_spent: 0,
          },
        ])
        .select()
        .single()

      if (activityError) {
        console.error("❌ Error creating referral activity:", activityError)
        dispatch({ type: "SET_ERROR", payload: "Failed to process referral" })
        return
      }

      console.log("✅ Created referral activity:", activityData.id)

      // Create discounts with better error handling
      const discountExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const discountsToInsert = []

      // Create discount for the referee (person who used the referral link)
      if (currentUserUid) {
        console.log("🎫 Creating discount for referee:", currentUserUid)
        discountsToInsert.push({
          user_id: currentUserUid,
          discount_percentage: 15,
          is_active: true,
          expires_at: discountExpiry,
          referred_by: referrer.uid,
        })
      }

      // Create discount for the referrer
      console.log("🎫 Creating discount for referrer:", referrer.uid)
      discountsToInsert.push({
        user_id: referrer.uid,
        discount_percentage: 15,
        is_active: true,
        expires_at: discountExpiry,
        referred_by: referrer.uid,
      })

      console.log("🎫 Creating discounts for both users...")
      const { data: createdDiscounts, error: discountError } = await supabase
        .from("referral_discounts")
        .insert(discountsToInsert)
        .select()

      if (discountError) {
        console.error("❌ Error creating discounts:", discountError)
        // Don't fail the entire process if discounts fail
      } else {
        console.log("✅ Created discounts:", createdDiscounts)

        // If current user is the referee, immediately load their new discount
        if (currentUserUid && createdDiscounts) {
          const userDiscount = createdDiscounts.find((d) => d.user_id === currentUserUid)
          if (userDiscount) {
            console.log("🎫 Found discount for current user:", userDiscount)
            dispatch({ type: "SET_DISCOUNTS", payload: [userDiscount] })
          }
        }
      }

      // Update referrer stats with retry logic
      const updatedReferrals = (referrer.total_referrals || 0) + 1
      const updatedEarnings = (referrer.total_earnings || 0) + 25
      const updatedTier = calculateTier(updatedReferrals)

      console.log("📊 Updating referrer stats...")

      let updateSuccess = false
      let updateAttempts = 0
      const maxUpdateAttempts = 3

      while (!updateSuccess && updateAttempts < maxUpdateAttempts) {
        try {
          const { error: updateError } = await supabase
            .from("referral_users")
            .update({
              total_referrals: updatedReferrals,
              total_earnings: updatedEarnings,
              tier: updatedTier,
            })
            .eq("uid", referrer.uid)

          if (updateError) {
            throw updateError
          }

          updateSuccess = true
          console.log("✅ Updated referrer stats:", { updatedReferrals, updatedEarnings, updatedTier })
        } catch (error) {
          updateAttempts++
          console.error(`❌ Error updating referrer stats (attempt ${updateAttempts}):`, error)

          if (updateAttempts < maxUpdateAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * updateAttempts))
          }
        }
      }

      // Update the referred user's record
      if (currentUserUid) {
        try {
          await supabase.from("referral_users").update({ referred_by: referrer.uid }).eq("uid", currentUserUid)
        } catch (error) {
          console.error("❌ Error updating referred user record:", error)
        }
      }

      // Update current user if they are the referrer
      if (state.currentUser && referrer.uid === state.currentUser.uid) {
        console.log("🔄 Current user is the referrer, updating their status...")

        dispatch({
          type: "UPDATE_USER",
          payload: {
            totalReferrals: updatedReferrals,
            totalEarnings: updatedEarnings,
            tier: updatedTier,
            isReferrer: true,
          },
        })

        dispatch({ type: "ADD_ACTIVITY", payload: activityData })

        // Force refresh data in production
        const refreshDelay = state.environment === "production" ? 2000 : 500
        setTimeout(async () => {
          await refreshUserData()
          await loadLeaderboard() // Ensure leaderboard updates
        }, refreshDelay)
      }

      dispatch({
        type: "SET_ERROR",
        payload: "🎉 Referral applied successfully! Both users received a 15% discount.",
      })

      console.log("✅ Referral tracking completed successfully")
    } catch (error) {
      console.error("❌ Error tracking referral:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to process referral. Please try again." })
    }
  }

  const trackPurchase = async (
    productId: string,
    productName: string,
    amount: number,
    discountUsed?: number,
  ): Promise<void> => {
    if (!state.currentUser) return

    try {
      const { data: referralActivity } = await supabase
        .from("referral_activities")
        .select("*")
        .eq("referee_id", state.currentUser.uid)
        .single()

      const purchaseData = {
        user_id: state.currentUser.uid,
        referrer_id: referralActivity?.referrer_id || null,
        product_id: productId,
        product_name: productName,
        amount,
        discount_used: discountUsed || 0,
        purchase_date: new Date().toISOString(),
        referral_activity_id: referralActivity?.id || null,
      }

      const { data: purchase, error: purchaseError } = await supabase
        .from("referral_purchases")
        .insert([purchaseData])
        .select()
        .single()

      if (purchaseError) {
        console.error("❌ Error tracking purchase:", purchaseError)
        return
      }

      if (referralActivity) {
        const isFirstPurchase = !referralActivity.first_purchase_at

        await supabase
          .from("referral_activities")
          .update({
            first_purchase_at: isFirstPurchase ? new Date().toISOString() : referralActivity.first_purchase_at,
            total_purchases: (referralActivity.total_purchases || 0) + 1,
            total_spent: (referralActivity.total_spent || 0) + amount,
          })
          .eq("id", referralActivity.id)

        if (referralActivity.referrer_id) {
          const { data: referrerActivities } = await supabase
            .from("referral_activities")
            .select("id, first_purchase_at")
            .eq("referrer_id", referralActivity.referrer_id)

          const totalReferrals = referrerActivities?.length || 0
          const conversions = referrerActivities?.filter((a) => a.first_purchase_at).length || 0
          const conversionRate = totalReferrals > 0 ? (conversions / totalReferrals) * 100 : 0

          await supabase
            .from("referral_users")
            .update({ conversion_rate: conversionRate })
            .eq("uid", referralActivity.referrer_id)
        }
      }

      await supabase
        .from("referral_users")
        .update({
          total_purchases: (state.currentUser.totalPurchases || 0) + 1,
        })
        .eq("uid", state.currentUser.uid)

      dispatch({ type: "ADD_PURCHASE", payload: purchase })

      if (state.canAccessReferralDashboard) {
        await loadAnalytics()
      }
    } catch (error) {
      console.error("❌ Error tracking purchase:", error)
    }
  }

  const redeemDiscount = async (discountId: string): Promise<void> => {
    if (!state.currentUser) return

    try {
      const { error } = await supabase
        .from("referral_discounts")
        .update({ is_active: false, applied_at: new Date().toISOString() })
        .eq("id", discountId)
        .eq("user_id", state.currentUser.uid)

      if (error) {
        console.error("❌ Error redeeming discount:", error)
        return
      }

      // Remove the redeemed discount from state
      dispatch({
        type: "SET_DISCOUNTS",
        payload: state.discounts.filter((d) => d.id !== discountId),
      })

      dispatch({ type: "SET_ERROR", payload: "🎉 Discount applied to your purchase!" })

      // Refresh user data
      if (state.canAccessReferralDashboard) {
        await loadUserData(state.currentUser.uid)
      }
    } catch (error) {
      console.error("❌ Error redeeming discount:", error)
    }
  }

  const calculateTier = (totalReferrals: number): ReferralUser["tier"] => {
    if (totalReferrals >= 50) return "diamond"
    if (totalReferrals >= 30) return "platinum"
    if (totalReferrals >= 15) return "gold"
    if (totalReferrals >= 5) return "silver"
    return "bronze"
  }

  const getTierInfo = (tier: ReferralUser["tier"]) => {
    const tierMap = {
      bronze: { name: "Bronze", icon: "🥉", minReferrals: 0 },
      silver: { name: "Silver", icon: "🥈", minReferrals: 5 },
      gold: { name: "Gold", icon: "🥇", minReferrals: 15 },
      platinum: { name: "Platinum", icon: "💎", minReferrals: 30 },
      diamond: { name: "Diamond", icon: "💎", minReferrals: 50 },
    }
    return tierMap[tier]
  }

  const redeemCoupon = async (discountId: string) => {
    await redeemDiscount(discountId)
  }

  const contextValue: ReferralContextType = {
    state,
    generateReferralLink,
    trackReferral,
    trackPurchase,
    redeemDiscount,
    validateReferralCode,
    getTierInfo,
    redeemCoupon,
    initializeUserFromFirebase,
    loadAnalytics,
    processReferralFromUrl,
    refreshUserData,
  }

  return <ReferralContext.Provider value={contextValue}>{children}</ReferralContext.Provider>
}

export const useReferral = (): ReferralContextType => {
  const context = useContext(ReferralContext)
  if (!context) {
    throw new Error("useReferral must be used within a ReferralProvider")
  }
  return context
}
