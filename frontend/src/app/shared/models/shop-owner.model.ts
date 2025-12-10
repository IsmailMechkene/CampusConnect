export interface ContactInfo {
  email: string;
  phone: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export interface ShopDetails {
  id: string;
  name: string;
  motto: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  contactInfo: ContactInfo;
  ownerId: string;
  rating: number;
  reviewCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'customer';
  shopId?: string;
}