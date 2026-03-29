export type UserRole = 'buyer' | 'seller' | 'admin';
export type UserLang = 'ar' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  lang: UserLang;
  createdAt: string;
}

export type ProductStatus = 'active' | 'sold' | 'pending';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  warrantyDays: number;
  status: ProductStatus;
  sellerId: string;
  seller?: Partial<User>;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'completed' | 'disputed' | 'refunded';
export type EscrowStatus = 'held' | 'released' | 'refunded';

export interface Order {
  id: string;
  buyerId: string;
  productId: string;
  amount: number;
  commission: number;
  sellerAmount: number;
  status: OrderStatus;
  deliveryMethod?: string;
  escrowStatus: EscrowStatus;
  buyer?: Partial<User>;
  product?: Partial<Product>;
  payment?: Partial<Payment>;
  createdAt: string;
}

export type PaymentMethod = 'bank_khartoum' | 'fawry' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  transactionRef?: string;
  receiptUrl?: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}
