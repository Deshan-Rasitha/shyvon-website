export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  brand: string;
  netWeight: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
}

export interface ProductBenefit {
  title: string;
  description?: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  brand: string;
  netWeight: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  shortDescription: string;
  description: string;
  ingredients: string;
  benefits: string; // JSON string or text
  usageInstructions: string; // JSON string or text
  storageInstructions: string;
  manufacturingInfo: string;
  metaTitle: string | null;
  metaDescription: string | null;
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[];
  categories: { category: { id: string; slug: string; name: string } }[];
  reviews?: ReviewDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  productWeight: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  product?: {
    slug: string;
    images?: { url: string }[];
  };
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerEmail: string | null;
  deliveryAddress: string;
  city: string;
  orderNotes: string | null;
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  paymentProofUrl: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
  statusHistory?: {
    id: string;
    status: string;
    notes: string | null;
    changedBy: string;
    createdAt: string;
  }[];
}

export interface ReviewDetail {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string | null;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product?: {
    name: string;
    slug: string;
  };
}

export interface WebsiteSettingsDetail {
  id: string;
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  logoUrl: string | null;
  contactPhone: string;
  whatsappNumber: string;
  businessEmail: string;
  businessAddress: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankInstructions: string;
  isBankTransferEnabled: boolean;
  isCodEnabled: boolean;
  deliveryFeeStandard: number;
  deliveryFeeFreeThreshold: number;
  announcementText: string;
  announcementActive: boolean;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  qrTargetUrl: string;
}
