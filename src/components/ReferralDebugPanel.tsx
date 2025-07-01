

import type React from "react"
import { useState } from "react"
import { useReferral } from "../context/ReferralContext"

const ReferralDebugPanel: React.FC = () => {
  const { state, trackReferral } = useReferral()
  const [testEmail, setTestEmail] = useState("")
  const [testCode, setTestCode] = useState("")

  const handleTestReferral = async () => {
    if (testEmail && testCode) {
      await trackReferral(testEmail, testCode)
      setTestEmail("")
      setTestCode("")
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔧 Debug Panel</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-yellow-700 mb-2">Current User Info:</h4>
          <pre className="text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(
              {
                uid: state.currentUser?.uid,
                email: state.currentUser?.email,
                referralCode: state.currentUser?.referralCode,
                totalReferrals: state.currentUser?.totalReferrals,
                isReferrer: state.currentUser?.isReferrer,
                canAccessDashboard: state.canAccessReferralDashboard,
              },
              null,
              2,
            )}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700 mb-2">Activities ({state.activities.length}):</h4>
          <pre className="text-xs bg-yellow-100 p-2 rounded overflow-x-auto max-h-32">
            {JSON.stringify(
              state.activities.map((a) => ({
                id: a.id,
                referee_email: a.referee_email,
                joined_at: a.joined_at,
                reward_earned: a.reward_earned,
              })),
              null,
              2,
            )}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700 mb-2">Test Referral:</h4>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Test email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="px-3 py-2 border border-yellow-300 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Referral code"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              className="px-3 py-2 border border-yellow-300 rounded text-sm"
            />
            <button
              onClick={handleTestReferral}
              className="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
            >
              Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralDebugPanel
