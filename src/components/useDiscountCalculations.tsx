

import { useMemo } from "react"
import { useReferral } from "../context/ReferralContext"
import type { ReferralDiscount } from "../types"

interface DiscountCalculation {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountPercentage: number
  hasDiscount: boolean
  savings: number
  appliedDiscount: ReferralDiscount | null
}

export function useDiscountCalculation(basePrice: number): DiscountCalculation {
  const { state } = useReferral()

  return useMemo(() => {
    // Find the best active discount
    const activeDiscounts = state.discounts.filter(
      (discount) => !discount.used && (!discount.expires_at || new Date(discount.expires_at) > new Date()),
    )

    if (activeDiscounts.length === 0 || !state.currentUser) {
      return {
        originalPrice: basePrice,
        discountedPrice: basePrice,
        discountAmount: 0,
        discountPercentage: 0,
        hasDiscount: false,
        savings: 0,
        appliedDiscount: null,
      }
    }

    // Use the highest discount percentage
    const bestDiscount = activeDiscounts.reduce((best, current) =>
      current.discount_percentage > best.discount_percentage ? current : best,
    )

    const discountAmount = (basePrice * bestDiscount.discount_percentage) / 100
    const discountedPrice = basePrice - discountAmount

    return {
      originalPrice: basePrice,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountPercentage: bestDiscount.discount_percentage,
      hasDiscount: true,
      savings: Math.round(discountAmount * 100) / 100,
      appliedDiscount: bestDiscount,
    }
  }, [basePrice, state.discounts, state.currentUser])
}
