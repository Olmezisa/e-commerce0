export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  optionName: string;
  optionValue: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
