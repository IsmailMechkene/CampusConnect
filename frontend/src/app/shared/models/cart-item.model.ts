
//Interface representing an item in the shopping cart

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  image: string;
  unitPrice: number;
  quantity: number;
  shopName: string;
}


// Interface representing the cart summary

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}