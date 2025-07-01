

import { useReferral } from "../context/ReferralContext"

export default function DiscountDebugPanel() {
  const { state } = useReferral()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm shadow-lg z-50">
      <h4 className="font-bold text-blue-800 mb-2">🔧 Discount Debug</h4>

      <div className="text-xs space-y-2">
        <div>
          <strong>Current User:</strong>
          <div className="bg-blue-100 p-1 rounded mt-1">
            ID: {state.currentUser?.uid || "None"}
            <br />
            Email: {state.currentUser?.email || "None"}
          </div>
        </div>

        <div>
          <strong>Active Discounts ({state.discounts.length}):</strong>
          <div className="bg-blue-100 p-1 rounded mt-1 max-h-32 overflow-y-auto">
            {state.discounts.length > 0 ? (
              state.discounts.map((discount, index) => (
                <div key={discount.id} className="mb-1 text-xs">
                  #{index + 1}: {discount.discount_percentage}% (User: {discount.user_id.slice(-6)})
                  {discount.is_active ? " ✅" : " ❌"}
                  <br />
                  Expires: {new Date(discount.expires_at).toLocaleDateString()}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No discounts found</div>
            )}
          </div>
        </div>

        <div>
          <strong>Referral Status:</strong>
          <div className="bg-blue-100 p-1 rounded mt-1">
            Is Referrer: {state.currentUser?.isReferrer ? "Yes" : "No"}
            <br />
            Referred By: {state.currentUser?.referredBy || "None"}
            <br />
            Pending Code: {state.pendingReferralCode || "None"}
          </div>
        </div>
      </div>
    </div>
  )
}
