

import { useState } from "react"
import { useReferral } from "../context/ReferralContext"

export default function ReferralTestButton() {
  const { state, trackReferral } = useReferral()
  const [testEmail, setTestEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTestReferral = async () => {
    if (!testEmail || !state.currentUser?.referralCode) return

    setIsLoading(true)
    try {
      await trackReferral(testEmail, state.currentUser.referralCode!)
      setTestEmail("")
    } catch (error) {
      console.error("Test referral error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Only show in development
  if (state.environment !== "development") {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">🧪 Test Referral System</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Test Email (will be "referred" by you):
          </label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleTestReferral}
            disabled={!testEmail || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Test Referral"}
          </button>

          <button
            onClick={() => {
              const testUrl = `${window.location.origin}?ref=${state.currentUser?.referralCode}`
              window.open(testUrl, "_blank")
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔗 Open Referral Link
          </button>
        </div>

        <div className="text-sm text-blue-600">
          <p>
            <strong>Your referral code:</strong> {state.currentUser?.referralCode}
          </p>
          <p>
            <strong>Your referral link:</strong> {window.location.origin}?ref={state.currentUser?.referralCode}
          </p>
        </div>
      </div>
    </div>
  )
}
