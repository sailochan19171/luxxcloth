import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if Hugging Face API key is configured
    const apiKey = process.env.HUGGING_FACE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
    }

    // Parse the form data
    const formData = await request.formData()
    const personImage = formData.get("person_image") as File
    const clothImage = formData.get("cloth_image") as File

    if (!personImage || !clothImage) {
      return NextResponse.json({ error: "Both person_image and cloth_image are required" }, { status: 400 })
    }

    // Validate file types
    if (!personImage.type.startsWith("image/") || !clothImage.type.startsWith("image/")) {
      return NextResponse.json({ error: "Both files must be images" }, { status: 400 })
    }

    // Validate file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (personImage.size > maxSize || clothImage.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Prepare form data for Hugging Face API
    const hfFormData = new FormData()
    hfFormData.append("person_image", personImage)
    hfFormData.append("cloth_image", clothImage)

    // Call Hugging Face API
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: hfFormData,
    })

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text()
      console.error("Hugging Face API error:", errorText)

      // Handle specific error cases
      if (hfResponse.status === 503) {
        return NextResponse.json(
          { error: "Model is currently loading. Please try again in a few moments." },
          { status: 503 },
        )
      }

      return NextResponse.json({ error: "Virtual try-on processing failed" }, { status: hfResponse.status })
    }

    // Get the result image blob
    const resultBlob = await hfResponse.blob()

    // Return the image with appropriate headers
    return new NextResponse(resultBlob, {
      status: 200,
      headers: {
        "Content-Type": resultBlob.type,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Virtual try-on API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
