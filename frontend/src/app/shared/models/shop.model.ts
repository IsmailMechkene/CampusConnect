// export interface Shop {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
//   logo: string;
//   rating: number;
//   reviewCount: number;
//   tags: string[];
//   backgroundColor: string;
// }

export interface Shop {
  id: string;
  brandName: string;
  moto?: string | null;
  description?: string | null;
  keyword: string | null;
  brandEmail?: string | null;
  phoneNumber?: string | null;
  tag1?: string | null;
  tag2?: string | null;
  tag3?: string | null;
  tag4?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  x?: string | null;
  tiktok?: string | null;
  logo?: string | null;
  banner_image?: string | null;
  owner_id: string;
  created_at?: string;
  rating?: number | null;
  reviewCount?: number | null;
  tags?: string[] | null;
}

export interface ShopStatusResponse {
  hasShop: boolean;
  shop?: Shop;
}
