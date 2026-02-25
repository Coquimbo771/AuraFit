export type BodyShape = 'hourglass' | 'rectangle' | 'pear' | 'triangle' | 'inverted_triangle' | 'athletic';
export type SkinTone = 'cool' | 'warm' | 'neutral';
export type BlogCategory = 'color-theory' | 'body-types' | 'sustainability' | 'science';
export type ProductCategory = 'office' | 'gym' | 'party' | 'casual';
export type UserRole = 'client' | 'admin' | 'stylist';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: UserRole;
  phone?: string | null;
  preferences?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Biometric {
  id: string;
  user_id: string;
  height: number | null;
  body_shape: BodyShape | null;
  skin_tone: SkinTone | null;
  color_palette: string[] | null;
  scan_date: string;
  measurements: {
    shoulder?: number;
    waist?: number;
    hip?: number;
  } | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  occasion: string | null;
  image_url: string | null;
  sustainable_rating: number;
  sizes_available: string[];
  color_palette: string[] | null;
  created_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
}

export interface CheckoutState {
  couponCode: string;
  notes: string;
  shippingAddress: ShippingAddress | null;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_provider: string | null;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  product_id: string;
  match_score: number;
  reason: string | null;
  created_at: string;
}

export interface UserWardrobe {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author: string;
  category: BlogCategory;
  created_at: string;
  updated_at: string;
}

export interface ScanPreset {
  id: 'preset-a' | 'preset-b' | 'preset-c';
  bodyShape: BodyShape;
  skinTone: SkinTone;
  suggestedSize: string;
  colorPalette: Array<{ name: string; hex: string }>;
  styleRecommendations: string[];
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface BiometricState {
  currentScan: Biometric | null;
  scanHistory: Biometric[];
  loading: boolean;
  error: string | null;
}

export interface ShoppingState {
  filters: {
    occasion: ProductCategory[];
    sustainabilityMin: number;
    priceRange: [number, number];
  };
  savedItems: string[];
  cart: CartItem[];
  checkout: CheckoutState;
  orders: Order[];
}