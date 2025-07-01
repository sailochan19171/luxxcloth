

import type React from "react"

interface ThemedButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
}

const ThemedButton: React.FC<ThemedButtonProps> = ({ children, variant = "primary", onClick }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90"

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      style={{
        backgroundColor: variant === "primary" ? "var(--color-primary)" : "var(--color-secondary)",
        color: "white",
      }}
    >
      {children}
    </button>
  )
}

export default ThemedButton
