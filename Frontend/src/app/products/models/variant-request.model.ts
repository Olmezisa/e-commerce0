export interface VariantRequest {
  sku: string;
  optionName: string;
  optionValue: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
