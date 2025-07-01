import type React from "react"
import { useRef, useEffect, useState } from "react"
import { X, Camera, RotateCcw, Download, Share2, Settings, Palette, Upload, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "../types"

interface VirtualTryOnProps {
  product: Product
  selectedColor: string
  onClose: () => void
}

// Add this near the top of the component, after the imports
interface WindowWithProcess extends Window {
  process?: {
    env: Record<string, string | undefined>
  }
}

const getEnvVar = (key: string): string => {
  // For Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[`VITE_${key}`] || import.meta.env[`VITE_PUBLIC_${key}`] || ""
  }
  // For Next.js (fallback)
  if (typeof window !== "undefined" && (window as WindowWithProcess).process?.env) {
    return (window as WindowWithProcess).process?.env?.[`NEXT_PUBLIC_${key}`] || ""
  }
  // Default fallback
  return ""
}

// Hugging Face Virtual Try-On Service
class HuggingFaceVirtualTryOnService {
  private apiKey: string
  private baseUrl = "https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async processVirtualTryOn(personImage: Blob, clothImage: Blob): Promise<Blob> {
    const formData = new FormData()
    formData.append("person_image", personImage)
    formData.append("cloth_image", clothImage)

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Virtual try-on failed: ${response.statusText}`)
    }

    return await response.blob()
  }

  // Alternative method using backend proxy
  async processVirtualTryOnViaProxy(personImage: Blob, clothImage: Blob): Promise<Blob> {
    const formData = new FormData()
    formData.append("person_image", personImage)
    formData.append("cloth_image", clothImage)

    const response = await fetch("/api/virtual-try-on", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Virtual try-on failed: ${response.statusText}`)
    }

    return await response.blob()
  }
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, selectedColor, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [currentColor, setCurrentColor] = useState(selectedColor)
  const [showSettings, setShowSettings] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [personImageBlob, setPersonImageBlob] = useState<Blob | null>(null)
  const [useBackendProxy, setUseBackendProxy] = useState(true)

  // Initialize Hugging Face service
  const hfService = new HuggingFaceVirtualTryOnService(getEnvVar("HUGGING_FACE_API_KEY"))

  // Define all functions before useEffect to avoid hoisting issues
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })
      setStream(mediaStream)
      streamRef.current = mediaStream // Store in ref for cleanup
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageUrl)

        // Convert to blob for API processing
        canvas.toBlob((blob) => {
          if (blob) {
            setPersonImageBlob(blob)
          }
        }, "image/png")

        setIsCapturing(true)
      }
    }
  }

  const uploadPersonImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCapturedImage(imageUrl)
        setPersonImageBlob(file)
        setIsCapturing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const getClothImageBlob = async (): Promise<Blob> => {
    // Get the product image based on selected color
    const colorImage = product.colorImages?.[currentColor]?.[0] || product.image || "/placeholder.svg"
    const response = await fetch(colorImage)
    return await response.blob()
  }

  const processVirtualTryOn = async () => {
    if (!personImageBlob) {
      alert("Please capture or upload a person image first")
      return
    }

    setIsProcessing(true)
    setTryOnResult(null)

    try {
      // Get cloth image
      const clothImageBlob = await getClothImageBlob()

      let resultBlob: Blob

      if (useBackendProxy) {
        // Use backend proxy for better security and rate limiting
        resultBlob = await hfService.processVirtualTryOnViaProxy(personImageBlob, clothImageBlob)
      } else {
        // Direct client-side API call
        resultBlob = await hfService.processVirtualTryOn(personImageBlob, clothImageBlob)
      }

      // Convert result to URL for display
      const resultUrl = URL.createObjectURL(resultBlob)
      setTryOnResult(resultUrl)
    } catch (error) {
      console.error("Virtual try-on processing failed:", error)
      alert("Virtual try-on failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (tryOnResult) {
      const link = document.createElement("a")
      link.download = `virtual-tryOn-${product?.name || "product"}-${Date.now()}.png`
      link.href = tryOnResult
      link.click()
    }
  }

  const shareImage = async () => {
    if (tryOnResult && typeof navigator.share === "function") {
      try {
        const response = await fetch(tryOnResult)
        const blob = await response.blob()
        const file = new File([blob], `virtual-tryOn-${product?.name || "product"}.png`, { type: "image/png" })

        await navigator.share({
          title: `Virtual Try-On: ${product?.name || "Product"}`,
          text: `Check out how I look in ${product?.name || "this product"}!`,
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing image:", error)
      }
    }
  }

  const resetCapture = () => {
    setIsCapturing(false)
    setCapturedImage(null)
    setPersonImageBlob(null)
    setTryOnResult(null)
  }

  const getTryOnInstructions = () => {
    const category = (product?.category || "").toLowerCase()
    switch (category) {
      case "outerwear":
      case "blazers":
        return "Stand straight with arms slightly away from your body. Ensure your torso is fully visible."
      case "dresses":
        return "Step back to show your full body. Keep a neutral pose for best results."
      case "knitwear":
      case "shirts":
        return "Position your upper body in the frame. Keep your arms relaxed at your sides."
      default:
        return "Position yourself clearly in the frame for the best virtual try-on experience."
    }
  }

  useEffect(() => {
    startCamera()
    
    // Cleanup function
    return () => {
      // Clean up the current stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
        streamRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally omitting 'stream' dependency to prevent infinite loop

  // Validate product early - if invalid, show error UI
  if (!product || typeof product !== "object") {
    console.error("VirtualTryOn: Product is null or not an object", product)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <X size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Product Not Available</h3>
            <p className="text-sm mt-2">No product data available for virtual try-on.</p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Close virtual try-on"
          >
            Close
          </button>
        </div>
      </motion.div>
    )
  }

  if (!product.name || !product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    console.error("VirtualTryOn: Invalid product structure", product)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <X size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Invalid Product Data</h3>
            <p className="text-sm mt-2">This product cannot be used for virtual try-on due to missing data.</p>
            <p className="text-xs mt-1 text-gray-500">
              Missing: {!product.name ? "name" : ""} {!product.colors ? "colors" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Close virtual try-on"
          >
            Close
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">AI Virtual Try-On</h2>
                <p className="text-purple-100 mt-1">{product?.name || "Product"}</p>
                <p className="text-purple-200 text-sm mt-1">Powered by Hugging Face Kolors</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close virtual try-on"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Settings Panel */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-100 rounded-lg"
              >
                <h4 className="font-semibold mb-3">Try-On Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useBackendProxy}
                        onChange={(e) => setUseBackendProxy(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Use Backend Proxy (Recommended)</span>
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Backend proxy provides better security and rate limiting
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Processing Method</p>
                    <p className="text-xs text-gray-600">
                      {useBackendProxy ? "Server-side processing" : "Client-side processing"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Color Selection */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Palette size={20} className="text-purple-600" />
                <span className="font-medium text-gray-700">Try Different Colors:</span>
                <div className="flex space-x-2">
                  {(product.colors || []).map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color.value ? "border-purple-600 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Person Image Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Photo</h3>

                <div className="relative bg-black rounded-xl overflow-hidden aspect-[3/4]">
                  {!isCapturing ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 left-4 bg-purple-500/80 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>Camera Active</span>
                        </div>

                        {/* Guide overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-48 h-64 border-2 border-purple-400 rounded-2xl opacity-60 animate-pulse">
                            <div className="w-full h-full border border-purple-300 rounded-2xl animate-ping"></div>
                          </div>
                          <p className="text-purple-400 text-sm text-center mt-2">Position yourself here</p>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg max-w-xs">
                          <h4 className="font-semibold text-sm mb-1">Instructions</h4>
                          <p className="text-xs opacity-90">{getTryOnInstructions()}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="relative h-full">
                      <img src={capturedImage || ""} alt="Captured person" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Photo Ready!
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {!isCapturing ? (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                      >
                        <Camera size={20} />
                        <span>Capture Photo</span>
                      </button>
                      <button
                        onClick={uploadPersonImage}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Upload size={20} />
                        <span>Upload Photo</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={resetCapture}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                      >
                        <RotateCcw size={20} />
                        <span>Retake</span>
                      </button>
                      <button
                        onClick={processVirtualTryOn}
                        disabled={isProcessing}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Camera size={20} />
                            <span>Try On Clothing</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Result Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Virtual Try-On Result</h3>

                <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center">
                  {tryOnResult ? (
                    <div className="relative w-full h-full">
                      <img
                        src={tryOnResult || "/placeholder.svg"}
                        alt="Virtual try-on result"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Try-On Complete!
                      </div>
                    </div>
                  ) : isProcessing ? (
                    <div className="text-center">
                      <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Processing your virtual try-on...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Capture a photo and click "Try On Clothing"</p>
                      <p className="text-sm mt-2">to see the AI-generated result</p>
                    </div>
                  )}
                </div>

                {tryOnResult && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={downloadImage}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Download size={20} />
                      <span>Download</span>
                    </button>
                    {typeof navigator.share === "function" && (
                      <button
                        onClick={shareImage}
                        className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                      >
                        <Share2 size={20} />
                        <span>Share</span>
                      </button>
                    )}
                    <button
                      onClick={() => setTryOnResult(null)}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <RotateCcw size={20} />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Current Color</p>
                  <p>{(product.colors || []).find((c) => c.value === currentColor)?.name || "Selected Color"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Category</p>
                  <p>{product?.category || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">AI Model</p>
                  <p>Kolors Virtual Try-On</p>
                </div>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VirtualTryOn
