import { Product, DeliveryPartner } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Cashmere Blend Coat',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Outerwear',
    description: 'Luxurious cashmere blend coat with timeless silhouette. Crafted from the finest materials for ultimate comfort and style.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Camel', value: '#C19A6B' },
      { name: 'Navy', value: '#000080' }
    ],
    sizes: [
      { name: 'XS', value: 'xs', inStock: true },
      { name: 'S', value: 's', inStock: true },
      { name: 'M', value: 'm', inStock: true },
      { name: 'L', value: 'l', inStock: true },
      { name: 'XL', value: 'xl', inStock: false }
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    features: ['Premium cashmere blend', 'Tailored fit', 'Dry clean only', 'Made in Italy'],
    materials: ['70% Cashmere', '25% Wool', '5% Silk'],
    careInstructions: ['Dry clean only', 'Store on padded hangers', 'Avoid direct sunlight']
  },
  {
    id: '2',
    name: 'Silk Midi Dress',
    price: 459,
    originalPrice: 599,
    image: 'https://images.pexels.com/photos/1496647/pexels-photo-1496647.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/1496647/pexels-photo-1496647.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Dresses',
    description: 'Elegant silk midi dress perfect for any occasion. Features a flattering A-line silhouette and luxurious silk fabric.',
    colors: [
      { name: 'Ivory', value: '#FFFFF0' },
      { name: 'Black', value: '#000000' },
      { name: 'Burgundy', value: '#800020' }
    ],
    sizes: [
      { name: 'XS', value: 'xs', inStock: true },
      { name: 'S', value: 's', inStock: true },
      { name: 'M', value: 'm', inStock: true },
      { name: 'L', value: 'l', inStock: true },
      { name: 'XL', value: 'xl', inStock: true }
    ],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    features: ['100% Silk', 'A-line silhouette', 'Hidden zipper', 'Lined'],
    materials: ['100% Mulberry Silk'],
    careInstructions: ['Hand wash cold', 'Hang to dry', 'Iron on low heat']
  },
  {
    id: '3',
    name: 'Tailored Blazer',
    price: 329,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Blazers',
    description: 'Perfectly tailored blazer for the modern professional. Features structured shoulders and a flattering fit.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#000080' },
      { name: 'Charcoal', value: '#36454F' }
    ],
    sizes: [
      { name: 'XS', value: 'xs', inStock: true },
      { name: 'S', value: 's', inStock: true },
      { name: 'M', value: 'm', inStock: true },
      { name: 'L', value: 'l', inStock: true },
      { name: 'XL', value: 'xl', inStock: true }
    ],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    features: ['Structured shoulders', 'Two-button closure', 'Functional pockets', 'Fully lined'],
    materials: ['95% Wool', '5% Elastane'],
    careInstructions: ['Dry clean only', 'Steam to remove wrinkles', 'Store on hangers']
  },
  {
    id: '4',
    name: 'Leather Handbag',
    price: 189,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Accessories',
    description: 'Premium leather handbag with gold-tone hardware. Perfect for everyday use or special occasions.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Brown', value: '#8B4513' },
      { name: 'Tan', value: '#D2B48C' }
    ],
    sizes: [
      { name: 'One Size', value: 'onesize', inStock: true }
    ],
    rating: 4.6,
    reviews: 203,
    inStock: true,
    features: ['Genuine leather', 'Gold-tone hardware', 'Multiple compartments', 'Adjustable strap'],
    materials: ['100% Genuine Leather'],
    careInstructions: ['Clean with leather conditioner', 'Store in dust bag', 'Avoid water exposure']
  },
  {
    id: '5',
    name: 'Wool Turtleneck',
    price: 149,
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Knitwear',
    description: 'Soft merino wool turtleneck in neutral tones. Perfect for layering or wearing alone.',
    colors: [
      { name: 'Cream', value: '#F5F5DC' },
      { name: 'Black', value: '#000000' },
      { name: 'Gray', value: '#808080' }
    ],
    sizes: [
      { name: 'XS', value: 'xs', inStock: true },
      { name: 'S', value: 's', inStock: true },
      { name: 'M', value: 'm', inStock: true },
      { name: 'L', value: 'l', inStock: true },
      { name: 'XL', value: 'xl', inStock: true }
    ],
    rating: 4.8,
    reviews: 167,
    inStock: true,
    features: ['100% Merino wool', 'Soft hand feel', 'Machine washable', 'Ribbed cuffs'],
    materials: ['100% Merino Wool'],
    careInstructions: ['Machine wash cold', 'Lay flat to dry', 'Do not bleach']
  },
  {
    id: '6',
    name: 'Designer Sunglasses',
    price: 299,
    image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop'
    ],
    category: 'Accessories',
    description: 'Sophisticated designer sunglasses with UV protection. Features premium acetate frames.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Tortoise', value: '#8B4513' },
      { name: 'Clear', value: '#F8F8FF' }
    ],
    sizes: [
      { name: 'One Size', value: 'onesize', inStock: true }
    ],
    rating: 4.5,
    reviews: 92,
    inStock: true,
    features: ['UV400 protection', 'Acetate frames', 'Polarized lenses', 'Case included'],
    materials: ['Acetate frames', 'Polarized lenses'],
    careInstructions: ['Clean with microfiber cloth', 'Store in case', 'Avoid extreme temperatures']
  }
];

export const deliveryPartners: DeliveryPartner[] = [
  {
    id: '1',
    name: 'Express Delivery',
    logo: '🚚',
    estimatedDays: '1-2 days',
    price: 15,
    features: ['Next day delivery', 'Real-time tracking', 'Signature required']
  },
  {
    id: '2',
    name: 'Standard Shipping',
    logo: '📦',
    estimatedDays: '3-5 days',
    price: 8,
    features: ['Free on orders over $100', 'Tracking included', 'Safe delivery']
  },
  {
    id: '3',
    name: 'Premium White Glove',
    logo: '🎩',
    estimatedDays: '2-3 days',
    price: 25,
    features: ['White glove service', 'Unpacking included', 'Premium packaging']
  }
];