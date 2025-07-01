

import type React from "react"
import { useTheme } from "../context/ThemeContext"

interface ThemedCardProps {
  children: React.ReactNode
  className?: string
}

const ThemedCard: React.FC<ThemedCardProps> = ({ children, className = "" }) => {
  const { currentTheme } = useTheme()

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${className}`}
      style={{
        backgroundColor: currentTheme.colors?.surface || currentTheme.surface,
        borderColor: currentTheme.colors?.accent || currentTheme.accent,
        color: currentTheme.colors?.text || currentTheme.text,
      }}
    >
      {children}
    </div>
  )
}

export default ThemedCard
