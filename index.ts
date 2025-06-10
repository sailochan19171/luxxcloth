export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  colors: Color[];
  sizes: Size[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  materials: string[];
  careInstructions: string[];
}

export interface Color {
  name: string;
  value: string;
  image?: string;
}

export interface Size {
  name: string;
  value: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: Color;
  selectedSize: Size;
  quantity: number;
}

export interface TestimonialType {
  id: string;
  name: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface LookbookItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  logo: string;
  estimatedDays: string;
  price: number;
  features: string[];
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}