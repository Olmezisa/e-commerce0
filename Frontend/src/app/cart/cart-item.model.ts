import { Product } from '../products/models/product.model';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  variantId?:  number;
}
