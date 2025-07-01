import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ShoppingBag, Search, UserIcon, Palette, LogOut, Users } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useReferral } from "../context/ReferralContext"
import ThemeSelector from "./ThemeSelector"
import ReferralModal from "./ReferralModal"
import { auth } from "../firebase"
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { products } from "../data/products"

interface NavigationProps {
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  authTab: "signin" | "signup" | "forgot"
  setAuthTab: (tab: "signin" | "signup" | "forgot") => void
  authError: string
  setAuthError: (error: string) => void
  onCartOpen: () => void
}

const Navigation: React.FC<NavigationProps> = ({
  isAuthModalOpen,
  setIsAuthModalOpen,
  authTab,
  setAuthTab,
  authError,
  setAuthError,
  onCartOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof products>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [redirectResultChecked, setRedirectResultChecked] = useState(false)
  const { state: cartState } = useCart()
  const { state: referralState, trackReferral, initializeUserFromFirebase } = useReferral()
  const location = useLocation()
  const navigate = useNavigate()

  const hiddenNavbarPages = ["/collections", "/product" , "/order/:orderId"]
  const shouldHideNavbar = hiddenNavbarPages.some((page) => location.pathname.startsWith(page))

  // Initialize auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener...")
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log("Auth state changed:", {
          user: user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                providerData: user.providerData,
              }
            : null,
        })
        setCurrentUser(user)
        setAuthInitialized(true)
        setLoading(false)

        // Initialize referral system with Firebase user
        if (user) {
          await initializeUserFromFirebase(user)
        }
      },
      (error) => {
        console.error("Auth state change error:", error)
        setAuthInitialized(true)
        setLoading(false)
      },
    )

    return () => {
      console.log("Cleaning up auth state listener")
      unsubscribe()
    }
  }, [])

  // Handle redirect result for Google Sign-In (only once)
  useEffect(() => {
    if (!authInitialized || redirectResultChecked) return

    const handleRedirectResult = async () => {
      try {
        console.log("Checking for redirect result...")
        const result = await getRedirectResult(auth)

        if (result && result.user) {
          console.log("Google Sign-In redirect successful:", {
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            },
          })

          // Initialize referral system
          await initializeUserFromFirebase(result.user)

          if (referralState.pendingReferralCode && result.user.email) {
            await trackReferral(result.user.email, referralState.pendingReferralCode)
            setAuthError("Referral applied! You and your friend will receive rewards.")
          } else {
            setAuthError("Successfully signed in with Google!")
          }

          setIsAuthModalOpen(false)
          setTimeout(() => setAuthError(""), 3000)
        } else {
          console.log("No redirect result found")
        }
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string }
        console.error("Google Sign-In redirect error:", error)
        setAuthError(firebaseError.message || "Failed to sign in with Google. Please try again.")
      } finally {
        setLoading(false)
        setRedirectResultChecked(true) // Mark as checked to prevent infinite loop
      }
    }

    handleRedirectResult()
  }, [
    authInitialized,
    redirectResultChecked,
    referralState.pendingReferralCode,
    // Remove function dependencies that cause infinite loops
    // trackReferral, setIsAuthModalOpen, setAuthError, initializeUserFromFirebase
  ])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    
    // Debounce search to prevent excessive filtering
    const timeoutId = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered.slice(0, 10)) // Limit results to prevent performance issues
    }, 300) // 300ms debounce
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Referral", href: "/referral" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Track Delivery", href: "/track" },
  ]

  const scrollToSection = (href: string) => {
    navigate(href)
    setIsMenuOpen(false)
  }

  // Enhanced Google Sign-In with both popup and redirect fallback
  const handleGoogleSignIn = async () => {
    if (loading) return

    setLoading(true)
    setAuthError("")

    try {
      console.log("Starting Google Sign-In...")
      const provider = new GoogleAuthProvider()

      // Add scopes for better user info
      provider.addScope("profile")
      provider.addScope("email")

      // Set custom parameters
      provider.setCustomParameters({
        prompt: "select_account",
        hd: "", // Allow any domain
      })

      let result

      try {
        // Try popup first (better UX)
        console.log("Attempting popup sign-in...")
        result = await signInWithPopup(auth, provider)
        console.log("Popup sign-in successful:", result.user)
      } catch (popupError: unknown) {
        const firebaseError = popupError as { code?: string; message?: string }
        console.log("Popup failed, trying redirect:", firebaseError.message)

        // If popup fails, fall back to redirect
        if (
          firebaseError.code === "auth/popup-blocked" ||
          firebaseError.code === "auth/popup-closed-by-user" ||
          firebaseError.code === "auth/cancelled-popup-request"
        ) {
          console.log("Using redirect method...")
          await signInWithRedirect(auth, provider)
          return // Exit here as redirect will handle the rest
        } else {
          throw popupError
        }
      }

      // Handle successful popup sign-in
      if (result && result.user) {
        console.log("Sign-in successful:", {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })

        // Initialize referral system
        await initializeUserFromFirebase(result.user)

        if (referralState.pendingReferralCode && result.user.email) {
          await trackReferral(result.user.email, referralState.pendingReferralCode)
          setAuthError("Referral applied! You and your friend will receive rewards.")
        } else {
          setAuthError("Successfully signed in!")
        }

        setIsAuthModalOpen(false)
        setTimeout(() => setAuthError(""), 3000)
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      console.error("Google Sign-In error:", error)
      let errorMessage = "Failed to sign in with Google."

      switch (firebaseError.code) {
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked. Please allow popups and try again."
          break
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later."
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled."
          break
        default:
          errorMessage = firebaseError.message || errorMessage
      }

      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError("")
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await initializeUserFromFirebase(result.user)
      if (referralState.pendingReferralCode && result.user.email) {
        await trackReferral(result.user.email, referralState.pendingReferralCode)
        setAuthError("Referral applied! You and your friend will receive rewards.")
      }
      setIsAuthModalOpen(false)
    } catch (error: unknown) {
      const err = error as { message?: string }
      setAuthError(err.message || "Failed to sign in.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError("")
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await initializeUserFromFirebase(result.user)
      if (referralState.pendingReferralCode && result.user.email) {
        await trackReferral(result.user.email, referralState.pendingReferralCode)
        setAuthError("Referral applied! You and your friend will receive rewards.")
      }
      setIsAuthModalOpen(false)
    } catch (error: unknown) {
      const err = error as { message?: string }
      setAuthError(err.message || "Failed to sign up.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError("")
    try {
      await sendPasswordResetEmail(auth, email)
      setAuthError("Password reset email sent. Check your inbox.")
    } catch (error: unknown) {
      const err = error as { message?: string }
      setAuthError(err.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (loading) return

    try {
      setLoading(true)
      console.log("Logging out user...")

      await signOut(auth)

      // Clear all user-related state
      setCurrentUser(null)
      setIsProfileDropdownOpen(false)
      setAuthTab("signin")
      setEmail("")
      setPassword("")

      console.log("Successfully logged out")
      setAuthError("Successfully logged out!")
      setTimeout(() => setAuthError(""), 3000)
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      console.error("Logout error:", error)
      setAuthError(firebaseError.message || "Failed to log out. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (productId: string) => {
    setIsSearchModalOpen(false)
    setSearchQuery("")
    navigate(`/product/${productId}`)
  }

  const handleCartOpen = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true)
      setAuthTab("signin")
      setAuthError("Please sign in to access your cart.")
      return
    }
    onCartOpen()
  }

  const handleReferralOpen = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true)
      setAuthTab("signin")
      setAuthError("Please sign in to access the referral program.")
      return
    }
    setIsReferralModalOpen(true)
  }

  const getUserDisplayName = (user: User | null) => {
    if (!user) return "Guest"

    // For Google sign-in, prioritize displayName
    if (user.displayName && user.displayName.trim()) {
      return user.displayName
    }

    // If no displayName, try to get a meaningful name from email
    if (user.email) {
      const emailPrefix = user.email.split("@")[0]
      // Capitalize first letter and replace dots/underscores with spaces
      return emailPrefix
        .replace(/[._]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    return "User"
  }

  // Show loading state while auth is initializing
  if (!authInitialized) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl sm:text-2xl font-serif font-bold text-gray-900">LUXX</div>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (shouldHideNavbar) {
    return (
      <>
        <ThemeSelector isOpen={isThemeSelectorOpen} onClose={() => setIsThemeSelectorOpen(false)} />
        <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection("/")}
                className="text-xl sm:text-2xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                LUXX
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                onClick={handleCartOpen}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleReferralOpen}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <Users size={20} />
                {referralState.currentUser && 
                 referralState.currentUser.isReferrer && 
                 referralState.currentUser.totalReferrals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {referralState.currentUser.totalReferrals}
                  </span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL || "/placeholder.svg"}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                  <span className="text-sm font-medium max-w-24 truncate">
                    {currentUser ? getUserDisplayName(currentUser) : "Sign In"}
                  </span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {currentUser.photoURL && (
                              <img
                                src={currentUser.photoURL || "/placeholder.svg"}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {getUserDisplayName(currentUser)}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleReferralOpen()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          <Users size={16} />
                          <span>Referral Program</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <LogOut size={16} />
                          <span>{loading ? "Logging out..." : "Logout"}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsAuthModalOpen(true)
                            setAuthTab("signin")
                            setIsProfileDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setIsAuthModalOpen(true)
                            setAuthTab("signup")
                            setIsProfileDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsThemeSelectorOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Palette size={20} />
              </button>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Search size={18} />
              </button>
              <button
                onClick={handleCartOpen}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <ShoppingBag size={18} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cartState.itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleReferralOpen}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <Users size={18} />
                {referralState.currentUser && 
                 referralState.currentUser.isReferrer && 
                 referralState.currentUser.totalReferrals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {referralState.currentUser.totalReferrals}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  if (currentUser) {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  } else {
                    setIsAuthModalOpen(true)
                    setAuthTab("signin")
                  }
                }}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <UserIcon size={18} />
                )}
                {currentUser && (
                  <span className="text-xs max-w-16 truncate">{getUserDisplayName(currentUser).split(" ")[0]}</span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
        <div
          className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">LUXX</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-3 px-4 text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleReferralOpen()
                  }}
                  className="flex items-center space-x-2 w-full py-3 px-4 text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <Users size={20} />
                  <span>Referral Program</span>
                  {referralState.currentUser && 
                   referralState.currentUser.isReferrer && 
                   referralState.currentUser.totalReferrals > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {referralState.currentUser.totalReferrals}
                    </span>
                  )}
                </button>
              </div>
              <div className="pt-4 border-t border-gray-200">
                {currentUser ? (
                  <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {currentUser.photoURL && (
                        <img
                          src={currentUser.photoURL || "/placeholder.svg"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900">{getUserDisplayName(currentUser)}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center justify-between px-4">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      disabled={loading}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 text-base disabled:opacity-50"
                    >
                      <LogOut size={20} />
                      <span>{loading ? "Logging out..." : "Logout"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsAuthModalOpen(true)
                        setAuthTab("signin")
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 text-base"
                    >
                      <UserIcon size={20} />
                      <span>Sign In</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsThemeSelectorOpen(true)
                    }}
                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Palette size={20} />
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isSearchModalOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSearchModalOpen(false)}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 max-h-[90vh] overflow-hidden">
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-serif text-gray-900 mb-6 font-bold text-center">Search LUXX</h2>
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for clothes, jewelry, and more..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="text-center text-gray-600">No results found for "{searchQuery}"</p>
            )}
            {searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleResultClick(product.id)}
                className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal - Fixed for Mobile */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAuthModalOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAuthModalOpen(false)}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X size={24} />
          </button>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">LUXX</h3>
            <p className="text-gray-600 text-sm">Welcome to luxury fashion</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: "signin", label: "Sign In" },
              { key: "signup", label: "Sign Up" },
              { key: "forgot", label: "Reset" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setAuthTab(tab.key as "signin" | "signup" | "forgot")
                  setAuthError("")
                  setEmail("")
                  setPassword("")
                }}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                  authTab === tab.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Google Sign In Button */}
          {(authTab === "signin" || authTab === "signup") && (
            <div className="mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-1.11.75-2.55 1.19-3.71 1.19-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.05 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{loading ? "Signing in..." : "Continue with Google"}</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          {authTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              {authError && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    authError.includes("Referral applied!") || authError.includes("Successfully")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {authError}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {authTab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
              {authError && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    authError.includes("Referral applied!") || authError.includes("Successfully")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {authError}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {authTab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              {authError && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    authError.includes("sent")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {authError}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Sending Reset Email..." : "Send Reset Email"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>

      <ThemeSelector isOpen={isThemeSelectorOpen} onClose={() => setIsThemeSelectorOpen(false)} />
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
    </>
  )
}

export default Navigation
