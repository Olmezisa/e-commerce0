export interface SellerRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  corporate: boolean;
  brandName?: string;
}
