import { Product } from '../products/models/product.model';

export interface CartItem {
  productId: number;
  productName: string;
  product:Product;
  price: number;
  quantity: number;
  variantId?:  number;
}
