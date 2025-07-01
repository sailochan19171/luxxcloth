import type { ReferralDiscount } from "../context/ReferralContext"

export const calculateDiscountedPrice = (
  originalPrice: number,
  discounts: ReferralDiscount[],
): { discountedPrice: number; appliedDiscount: ReferralDiscount | null } => {
  if (!discounts || discounts.length === 0) {
    return { discountedPrice: originalPrice, appliedDiscount: null }
  }

  // Find the highest active discount
  const activeDiscounts = discounts.filter(
    (discount) => discount.is_active && discount.expires_at && new Date(discount.expires_at) > new Date(),
  )

  if (activeDiscounts.length === 0) {
    return { discountedPrice: originalPrice, appliedDiscount: null }
  }

  const bestDiscount = activeDiscounts.reduce((best, current) =>
    current.discount_percentage > best.discount_percentage ? current : best,
  )

  const discountAmount = (originalPrice * bestDiscount.discount_percentage) / 100
  const discountedPrice = Math.max(0, originalPrice - discountAmount)

  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    appliedDiscount: bestDiscount,
  }
}
