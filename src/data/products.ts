// Product Types
export interface Color {
  name: string
  value: string
}

export interface Size {
  name: string
  value: string
  inStock: boolean
  sku: string
}

export interface ThreeDModel {
  url: string
  format: string
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  animations: Array<{ name: string; duration: number; loop: boolean }>
  material: {
    type: string
    textureMap: string
    normalMap: string
    roughness: number
    metalness: number
  }
  cameraSettings: {
    position: { x: number; y: number; z: number }
    fov: number
  }
}

export interface Theme {
  backgroundColor: string
  texture: string
  lighting: string
  environment: string
  ambientEffects: string[]
}

export interface Product {
  id: string
  sku: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  colorImages: Record<string, string[]>
  threeDModel: ThreeDModel
  theme: Theme
  category: string
  description: string
  colors: Color[]
  sizes: Size[]
  rating: number
  reviews: number
  inStock: boolean
  isSale?: boolean
  isNew?: boolean
  canTryOn?: boolean
  tags: string[]
  features: string[]
  materials: string[]
  careInstructions: string[]
  warranty: string
  returnPeriod: string
}

export interface DeliveryPartner {
  id: string
  name: string
  logo: string
  estimatedDays: string
  price: number
  features: string[]
}

// Products Data with Fixed Image URLs
export const products: Product[] = [
  {
    id: "1",
    sku: "CBC-001",
    name: "Cashmere Blend Luxury Coat",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#36454F": ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80"],
      "#C19A6B": ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80"],
      "#000080": ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/cashmere-coat.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "sway", duration: 2, loop: true },
        { name: "fold", duration: 1.5, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/cashmere-fabric.jpg",
        normalMap: "/assets/textures/cashmere-normal.jpg",
        roughness: 0.8,
        metalness: 0.1,
      },
      cameraSettings: {
        position: { x: 0, y: 1.5, z: 3 },
        fov: 50,
      },
    },
    theme: {
      backgroundColor: "#2E3A24",
      texture: "mossy-wood",
      lighting: "soft-ambient",
      environment: "forest-clearing-hdr",
      ambientEffects: ["falling-leaves", "light-mist", "soft-shadows"],
    },
    category: "Outerwear",
    description: "Exquisite cashmere blend coat with premium wool lining, perfect for sophisticated winter styling.",
    colors: [
      { name: "Charcoal", value: "#36454F" },
      { name: "Camel", value: "#C19A6B" },
      { name: "Navy", value: "#000080" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "CBC-001-XS" },
      { name: "S", value: "s", inStock: true, sku: "CBC-001-S" },
      { name: "M", value: "m", inStock: true, sku: "CBC-001-M" },
      { name: "L", value: "l", inStock: false, sku: "CBC-001-L" },
      { name: "XL", value: "xl", inStock: true, sku: "CBC-001-XL" },
    ],
    rating: 4.8,
    reviews: 247,
    inStock: true,
    isSale: true,
    canTryOn: true,
    tags: ["luxury", "winter", "cashmere", "professional"],
    features: [
      "Premium cashmere blend fabric",
      "Wool lining for warmth",
      "Tailored fit",
      "Water-resistant finish",
      "Hidden button closure",
    ],
    materials: ["70% Cashmere", "20% Wool", "10% Silk"],
    careInstructions: ["Dry clean only", "Store on padded hanger", "Avoid direct sunlight"],
    warranty: "2 years",
    returnPeriod: "30 days",
  },
  {
    id: "2",
    sku: "SMD-002",
    name: "Silk Midi Evening Dress",
    price: 449,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#50C878": ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80"],
      "#191970": ["https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?auto=format&fit=crop&w=1200&q=80"],
      "#800020": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/silk-dress.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "flow", duration: 3, loop: true },
        { name: "twirl", duration: 2, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/silk-fabric.jpg",
        normalMap: "/assets/textures/silk-normal.jpg",
        roughness: 0.6,
        metalness: 0.05,
      },
      cameraSettings: {
        position: { x: 0, y: 1.2, z: 2.5 },
        fov: 45,
      },
    },
    theme: {
      backgroundColor: "#3A4A2E",
      texture: "leafy-ground",
      lighting: "natural-diffuse",
      environment: "forest-canopy-hdr",
      ambientEffects: ["gentle-wind", "leaf-rustle", "soft-shadows"],
    },
    category: "Dresses",
    description: "Flowing silk midi dress with elegant draping, designed for special occasions and evening events.",
    colors: [
      { name: "Emerald", value: "#50C878" },
      { name: "Midnight Blue", value: "#191970" },
      { name: "Burgundy", value: "#800020" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "SMD-002-XS" },
      { name: "S", value: "s", inStock: true, sku: "SMD-002-S" },
      { name: "M", value: "m", inStock: true, sku: "SMD-002-M" },
      { name: "L", value: "l", inStock: true, sku: "SMD-002-L" },
      { name: "XL", value: "xl", inStock: false, sku: "SMD-002-XL" },
    ],
    rating: 4.6,
    reviews: 189,
    inStock: true,
    isNew: true,
    canTryOn: true,
    tags: ["silk", "evening", "elegant", "midi"],
    features: [
      "100% Pure silk fabric",
      "Flowing A-line silhouette",
      "Hidden side zipper",
      "Fully lined",
      "Adjustable shoulder straps",
    ],
    materials: ["100% Silk", "Polyester lining"],
    careInstructions: ["Hand wash cold", "Hang dry", "Iron on low heat", "Store on hanger"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "3",
    sku: "TWB-003",
    name: "Tailored Wool Blazer",
    price: 349,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#36454F": ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"],
      "#000080": ["https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80"],
      "#F5F5DC": ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/tailored-blazer.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 8, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "swing", duration: 2.5, loop: true },
        { name: "button-up", duration: 1.8, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/wool-fabric.jpg",
        normalMap: "/assets/textures/wool-normal.jpg",
        roughness: 0.7,
        metalness: 0.1,
      },
      cameraSettings: {
        position: { x: 0, y: 1.3, z: 3 },
        fov: 50,
      },
    },
    theme: {
      backgroundColor: "#4A3A2E",
      texture: "rough-bark",
      lighting: "dramatic-spot",
      environment: "forest-edge-hdr",
      ambientEffects: ["twig-snap", "soft-shadows"],
    },
    category: "Blazers",
    description: "Precision-tailored wool blazer with contemporary styling, perfect for professional and casual wear.",
    colors: [
      { name: "Charcoal Grey", value: "#36454F" },
      { name: "Navy", value: "#000080" },
      { name: "Cream", value: "#F5F5DC" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "TWB-003-XS" },
      { name: "S", value: "s", inStock: true, sku: "TWB-003-S" },
      { name: "M", value: "m", inStock: false, sku: "TWB-003-M" },
      { name: "L", value: "l", inStock: true, sku: "TWB-003-L" },
      { name: "XL", value: "xl", inStock: true, sku: "TWB-003-XL" },
    ],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    canTryOn: true,
    tags: ["wool", "professional", "tailored", "versatile"],
    features: [
      "Premium wool construction",
      "Structured shoulders",
      "Two-button closure",
      "Functional sleeve buttons",
      "Interior pockets",
    ],
    materials: ["85% Wool", "15% Polyester"],
    careInstructions: ["Dry clean recommended", "Steam to remove wrinkles", "Store on sturdy hanger"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "4",
    sku: "ILH-004",
    name: "Italian Leather Handbag",
    price: 599,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#A0522D": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"],
      "#800020": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"],
      "#F5DEB3": ["https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/leather-handbag.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "bounce", duration: 1.5, loop: true },
        { name: "open-zip", duration: 1, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/leather-texture.jpg",
        normalMap: "/assets/textures/leather-normal.jpg",
        roughness: 0.4,
        metalness: 0.2,
      },
      cameraSettings: {
        position: { x: 0, y: 0.5, z: 1.5 },
        fov: 40,
      },
    },
    theme: {
      backgroundColor: "#2E4A3A",
      texture: "polished-leather",
      lighting: "warm-glow",
      environment: "forest-path-hdr",
      ambientEffects: ["light-dust", "soft-shadows"],
    },
    category: "Accessories",
    description: "Handcrafted Italian leather handbag with gold hardware and sophisticated design details.",
    colors: [
      { name: "Cognac", value: "#A0522D" },
      { name: "Black", value: "#000000" },
      { name: "Burgundy", value: "#800020" },
      { name: "Nude", value: "#F5DEB3" },
    ],
    sizes: [{ name: "One Size", value: "onesize", inStock: true, sku: "ILH-004-OS" }],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    isSale: true,
    tags: ["leather", "italian", "luxury", "handbag"],
    features: [
      "Genuine Italian leather",
      "Gold-tone hardware",
      "Multiple compartments",
      "Removable shoulder strap",
      "Protective dust bag included",
    ],
    materials: ["100% Italian Leather", "Gold-plated hardware"],
    careInstructions: ["Clean with leather conditioner", "Store in dust bag", "Avoid water exposure"],
    warranty: "2 years",
    returnPeriod: "30 days",
  },
  {
    id: "5",
    sku: "MWT-005",
    name: "Merino Wool Turtleneck",
    price: 189,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#F5F5DC": ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80"],
      "#36454F": ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80"],
      "#C19A6B": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"],
      "#87A96B": ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/wool-turtleneck.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "stretch", duration: 2, loop: true },
        { name: "fold-collar", duration: 1.2, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/wool-texture.jpg",
        normalMap: "/assets/textures/wool-normal.jpg",
        roughness: 0.9,
        metalness: 0.05,
      },
      cameraSettings: {
        position: { x: 0, y: 1, z: 2.5 },
        fov: 45,
      },
    },
    theme: {
      backgroundColor: "#3A2E4A",
      texture: "knit-fabric",
      lighting: "cool-ambient",
      environment: "forest-dusk-hdr",
      ambientEffects: ["gentle-mist", "leaf-scatter", "soft-shadows"],
    },
    category: "Knitwear",
    description: "Luxuriously soft merino wool turtleneck with ribbed detailing and contemporary fit.",
    colors: [
      { name: "Cream", value: "#F5F5DC" },
      { name: "Charcoal", value: "#36454F" },
      { name: "Camel", value: "#C19A6B" },
      { name: "Black", value: "#000000" },
      { name: "Sage Green", value: "#87A96B" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "MWT-005-XS" },
      { name: "S", value: "s", inStock: true, sku: "MWT-005-S" },
      { name: "M", value: "m", inStock: true, sku: "MWT-005-M" },
      { name: "L", value: "l", inStock: true, sku: "MWT-005-L" },
      { name: "XL", value: "xl", inStock: false, sku: "MWT-005-XL" },
    ],
    rating: 4.5,
    reviews: 124,
    inStock: true,
    canTryOn: true,
    tags: ["merino", "wool", "turtleneck", "comfortable"],
    features: [
      "100% Merino wool",
      "Ribbed turtleneck collar",
      "Relaxed fit",
      "Seamless construction",
      "Machine washable",
    ],
    materials: ["100% Merino Wool"],
    careInstructions: ["Machine wash cold", "Lay flat to dry", "Do not bleach", "Iron on low"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "6",
    sku: "DAS-006",
    name: "Designer Aviator Sunglasses",
    price: 329,
    originalPrice: 459,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#FFD700": ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80"],
      "#C0C0C0": ["https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80"],
      "#E8B4A6": ["https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/sunglasses.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 8, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "rotate", duration: 2, loop: true },
        { name: "lens-flip", duration: 1, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/acetate-texture.jpg",
        normalMap: "/assets/textures/acetate-normal.jpg",
        roughness: 0.3,
        metalness: 0.3,
      },
      cameraSettings: {
        position: { x: 0, y: 0.3, z: 1 },
        fov: 35,
      },
    },
    theme: {
      backgroundColor: "#4A2E3A",
      texture: "polished-metal",
      lighting: "high-contrast",
      environment: "forest-stream-hdr",
      ambientEffects: ["sparkle", "lens-flare", "soft-shadows"],
    },
    category: "Accessories",
    description: "Classic aviator sunglasses with premium lenses and titanium frame construction.",
    colors: [
      { name: "Gold Frame", value: "#FFD700" },
      { name: "Silver Frame", value: "#C0C0C0" },
      { name: "Black Frame", value: "#000000" },
      { name: "Rose Gold", value: "#E8B4A6" },
    ],
    sizes: [{ name: "One Size", value: "onesize", inStock: true, sku: "DAS-006-OS" }],
    rating: 4.4,
    reviews: 89,
    inStock: true,
    isSale: true,
    tags: ["sunglasses", "aviator", "designer", "titanium"],
    features: [
      "Titanium frame construction",
      "Polarized lenses",
      "UV400 protection",
      "Adjustable nose pads",
      "Premium case included",
    ],
    materials: ["Titanium frame", "Polarized glass lenses"],
    careInstructions: ["Clean with microfiber cloth", "Store in case", "Avoid harsh chemicals"],
    warranty: "2 years",
    returnPeriod: "30 days",
  },
  {
    id: "7",
    sku: "LCS-007",
    name: "Linen Casual Shirt",
    price: 129,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#F5F5F5": ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80"],
      "#4682B4": ["https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80"],
      "#228B22": ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/linen-shirt.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "sway", duration: 2, loop: true },
        { name: "fold", duration: 1.5, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/linen-fabric.jpg",
        normalMap: "/assets/textures/linen-normal.jpg",
        roughness: 0.7,
        metalness: 0.05,
      },
      cameraSettings: {
        position: { x: 0, y: 1.2, z: 2.5 },
        fov: 45,
      },
    },
    theme: {
      backgroundColor: "#F5E6CC",
      texture: "sand-texture",
      lighting: "natural-diffuse",
      environment: "beach-hdr",
      ambientEffects: ["gentle-wind", "sand-dust"],
    },
    category: "Shirts",
    description: "Breathable linen shirt with a relaxed fit, ideal for casual summer outings.",
    colors: [
      { name: "White", value: "#F5F5F5" },
      { name: "Steel Blue", value: "#4682B4" },
      { name: "Forest Green", value: "#228B22" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "S", value: "s", inStock: true, sku: "LCS-007-S" },
      { name: "M", value: "m", inStock: true, sku: "LCS-007-M" },
      { name: "L", value: "l", inStock: true, sku: "LCS-007-L" },
      { name: "XL", value: "xl", inStock: false, sku: "LCS-007-XL" },
    ],
    rating: 4.3,
    reviews: 98,
    inStock: true,
    canTryOn: true,
    tags: ["linen", "casual", "summer", "breathable"],
    features: ["100% Pure linen", "Relaxed fit", "Button-down front", "Breathable fabric", "Roll-up sleeves"],
    materials: ["100% Linen"],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Iron on medium"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "8",
    sku: "VNS-008",
    name: "Velvet Night Suit",
    price: 279,
    originalPrice: 349,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#4B0082": ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80"],
      "#800020": ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80"],
      "#FFD700": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/velvet-suit.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "flow", duration: 2.5, loop: true },
        { name: "adjust", duration: 1.5, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/velvet-fabric.jpg",
        normalMap: "/assets/textures/velvet-normal.jpg",
        roughness: 0.6,
        metalness: 0.1,
      },
      cameraSettings: {
        position: { x: 0, y: 1.5, z: 3 },
        fov: 50,
      },
    },
    theme: {
      backgroundColor: "#2C2C54",
      texture: "velvet-texture",
      lighting: "soft-ambient",
      environment: "night-sky-hdr",
      ambientEffects: ["star-twinkle", "soft-shadows"],
    },
    category: "Sleepwear",
    description: "Luxurious velvet night suit for ultimate comfort and elegance during your rest.",
    colors: [
      { name: "Indigo", value: "#4B0082" },
      { name: "Burgundy", value: "#800020" },
      { name: "Black", value: "#000000" },
      { name: "Gold", value: "#FFD700" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "VNS-008-XS" },
      { name: "S", value: "s", inStock: true, sku: "VNS-008-S" },
      { name: "M", value: "m", inStock: true, sku: "VNS-008-M" },
      { name: "L", value: "l", inStock: false, sku: "VNS-008-L" },
    ],
    rating: 4.6,
    reviews: 145,
    inStock: true,
    isSale: true,
    canTryOn: true,
    tags: ["velvet", "sleepwear", "luxury", "comfortable"],
    features: ["Soft velvet fabric", "Relaxed fit", "Elastic waistband", "Piped detailing", "Machine washable"],
    materials: ["95% Velvet", "5% Spandex"],
    careInstructions: ["Machine wash cold", "Lay flat to dry", "Do not iron"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "9",
    sku: "DJP-009",
    name: "Denim High-Waist Jeans",
    price: 159,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#1E90FF": ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1594633312681-425c7b97b4e3?auto=format&fit=crop&w=1200&q=80"],
      "#696969": ["https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?auto=format&fit=crop&w=1200&q=80"],
      "#F5F5F5": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/denim-jeans.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "stretch", duration: 2, loop: true },
        { name: "fold", duration: 1.5, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/denim-fabric.jpg",
        normalMap: "/assets/textures/denim-normal.jpg",
        roughness: 0.8,
        metalness: 0.05,
      },
      cameraSettings: {
        position: { x: 0, y: 1, z: 2.5 },
        fov: 45,
      },
    },
    theme: {
      backgroundColor: "#D3D3D3",
      texture: "concrete-texture",
      lighting: "natural-diffuse",
      environment: "urban-hdr",
      ambientEffects: ["light-dust", "soft-shadows"],
    },
    category: "Jeans",
    description: "High-waist denim jeans with a modern slim fit, perfect for everyday wear.",
    colors: [
      { name: "Blue", value: "#1E90FF" },
      { name: "Black", value: "#000000" },
      { name: "Grey", value: "#696969" },
      { name: "White", value: "#F5F5F5" },
    ],
    sizes: [
      { name: "XS", value: "xs", inStock: true, sku: "DJP-009-XS" },
      { name: "S", value: "s", inStock: true, sku: "DJP-009-S" },
      { name: "M", value: "m", inStock: true, sku: "DJP-009-M" },
      { name: "L", value: "l", inStock: true, sku: "DJP-009-L" },
      { name: "XL", value: "xl", inStock: false, sku: "DJP-009-XL" },
    ],
    rating: 4.4,
    reviews: 112,
    inStock: true,
    canTryOn: true,
    tags: ["denim", "jeans", "casual", "high-waist"],
    features: [
      "100% Cotton denim",
      "High-waist design",
      "Slim fit through thigh",
      "Five-pocket style",
      "Stretch fabric",
    ],
    materials: ["98% Cotton", "2% Spandex"],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "10",
    sku: "SLS-010",
    name: "Suede Loafer Shoes",
    price: 249,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582897085656-c636d006a246?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#8B4513": ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80"],
      "#4682B4": ["https://images.unsplash.com/photo-1582897085656-c636d006a246?auto=format&fit=crop&w=1200&q=80"],
      "#F5F5DC": ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/suede-loafers.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 8, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [
        { name: "rotate", duration: 2, loop: true },
        { name: "flex", duration: 1, loop: false },
      ],
      material: {
        type: "standard",
        textureMap: "/assets/textures/suede-texture.jpg",
        normalMap: "/assets/textures/suede-normal.jpg",
        roughness: 0.5,
        metalness: 0.1,
      },
      cameraSettings: {
        position: { x: 0, y: 0.5, z: 1.5 },
        fov: 40,
      },
    },
    theme: {
      backgroundColor: "#4A372E",
      texture: "wood-grain",
      lighting: "warm-glow",
      environment: "rustic-hdr",
      ambientEffects: ["light-dust", "soft-shadows"],
    },
    category: "Footwear",
    description: "Handcrafted suede loafers with cushioned insoles for all-day comfort and style.",
    colors: [
      { name: "Brown", value: "#8B4513" },
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#4682B4" },
      { name: "Beige", value: "#F5F5DC" },
    ],
    sizes: [
      { name: "7", value: "7", inStock: true, sku: "SLS-010-7" },
      { name: "8", value: "8", inStock: true, sku: "SLS-010-8" },
      { name: "9", value: "9", inStock: true, sku: "SLS-010-9" },
      { name: "10", value: "10", inStock: false, sku: "SLS-010-10" },
    ],
    rating: 4.7,
    reviews: 167,
    inStock: true,
    tags: ["suede", "loafers", "footwear", "casual"],
    features: [
      "Premium suede leather",
      "Cushioned insoles",
      "Non-slip sole",
      "Hand-stitched details",
      "Breathable lining",
    ],
    materials: ["100% Suede Leather", "Rubber sole"],
    careInstructions: ["Brush with suede brush", "Use suede protector spray", "Avoid water"],
    warranty: "2 years",
    returnPeriod: "30 days",
  },
  {
    id: "11",
    sku: "PSW-011",
    name: "Premium Silk Scarf",
    price: 89,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#FF6B6B": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"],
      "#4ECDC4": ["https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?auto=format&fit=crop&w=1200&q=80"],
      "#45B7D1": ["https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/silk-scarf.glb",
      format: "gltf",
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [{ name: "flutter", duration: 3, loop: true }],
      material: {
        type: "standard",
        textureMap: "/assets/textures/silk-scarf.jpg",
        normalMap: "/assets/textures/silk-normal.jpg",
        roughness: 0.2,
        metalness: 0.0,
      },
      cameraSettings: {
        position: { x: 0, y: 0.5, z: 1.5 },
        fov: 45,
      },
    },
    theme: {
      backgroundColor: "#FFF8E7",
      texture: "silk-texture",
      lighting: "soft-natural",
      environment: "studio-hdr",
      ambientEffects: ["gentle-breeze", "soft-shadows"],
    },
    category: "Accessories",
    description: "Luxurious hand-painted silk scarf with intricate patterns, perfect for any occasion.",
    colors: [
      { name: "Coral Pink", value: "#FF6B6B" },
      { name: "Turquoise", value: "#4ECDC4" },
      { name: "Sky Blue", value: "#45B7D1" },
    ],
    sizes: [{ name: "One Size", value: "onesize", inStock: true, sku: "PSW-011-OS" }],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isSale: true,
    tags: ["silk", "scarf", "luxury", "handpainted"],
    features: ["100% Pure silk", "Hand-painted design", "Rolled hem edges", "Versatile styling", "Gift box included"],
    materials: ["100% Mulberry Silk"],
    careInstructions: ["Hand wash cold", "Air dry flat", "Iron on silk setting"],
    warranty: "1 year",
    returnPeriod: "30 days",
  },
  {
    id: "12",
    sku: "LWD-012",
    name: "Luxury Watch Collection",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
    ],
    colorImages: {
      "#C0C0C0": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"],
      "#FFD700": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80"],
      "#000000": ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80"],
    },
    threeDModel: {
      url: "/assets/models/luxury-watch.glb",
      format: "gltf",
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animations: [{ name: "tick", duration: 1, loop: true }],
      material: {
        type: "standard",
        textureMap: "/assets/textures/watch-metal.jpg",
        normalMap: "/assets/textures/metal-normal.jpg",
        roughness: 0.1,
        metalness: 0.9,
      },
      cameraSettings: {
        position: { x: 0, y: 0.3, z: 1 },
        fov: 35,
      },
    },
    theme: {
      backgroundColor: "#1A1A1A",
      texture: "brushed-metal",
      lighting: "dramatic-spot",
      environment: "studio-hdr",
      ambientEffects: ["metallic-gleam", "soft-shadows"],
    },
    category: "Accessories",
    description: "Swiss-made luxury timepiece with automatic movement and sapphire crystal.",
    colors: [
      { name: "Silver", value: "#C0C0C0" },
      { name: "Gold", value: "#FFD700" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [{ name: "One Size", value: "onesize", inStock: true, sku: "LWD-012-OS" }],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isSale: true,
    tags: ["luxury", "watch", "swiss", "automatic"],
    features: [
      "Swiss automatic movement",
      "Sapphire crystal glass",
      "Water resistant 100m",
      "Leather strap",
      "2-year warranty",
    ],
    materials: ["Stainless Steel", "Genuine Leather", "Sapphire Crystal"],
    careInstructions: ["Avoid magnetic fields", "Regular service recommended", "Store in watch box"],
    warranty: "2 years",
    returnPeriod: "30 days",
  },
]

// Delivery Partners Data
export const deliveryPartners: DeliveryPartner[] = [
  {
    id: "1",
    name: "Express Delivery",
    logo: "🚚",
    estimatedDays: "1-2 days",
    price: 15,
    features: ["Next day delivery", "Real-time tracking", "Signature required"],
  },
  {
    id: "2",
    name: "Standard Shipping",
    logo: "📦",
    estimatedDays: "3-5 days",
    price: 8,
    features: ["Free on orders over $100", "Tracking included", "Safe delivery"],
  },
  {
    id: "3",
    name: "Premium White Glove",
    logo: "🎩",
    estimatedDays: "2-3 days",
    price: 25,
    features: ["White glove service", "Unpacking included", "Premium packaging"],
  },
]