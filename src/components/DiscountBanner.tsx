
import { useReferral } from "../context/ReferralContext"
import { X, Gift } from "lucide-react"

interface DiscountBannerProps {
  onClose?: () => void
}

export default function DiscountBanner({ onClose }: DiscountBannerProps) {
  const { state } = useReferral()

  if (!state.currentUser || state.discounts.length === 0) {
    return null
  }

  const activeDiscounts = state.discounts.filter(
    (discount) => discount.is_active && new Date(discount.expires_at) > new Date(),
  )

  if (activeDiscounts.length === 0) {
    return null
  }

  const maxDiscount = Math.max(...activeDiscounts.map((d) => d.discount_percentage))

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift size={20} className="text-white" />
          <div>
            <p className="font-medium">
              🎉 You have {activeDiscounts.length} active referral discount{activeDiscounts.length > 1 ? "s" : ""}!
            </p>
            <p className="text-sm text-blue-100">
              Save up to {maxDiscount}% on your purchases • Discounts applied automatically at checkout
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close discount banner"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
