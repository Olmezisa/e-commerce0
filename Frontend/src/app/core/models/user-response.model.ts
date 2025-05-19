export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  token?: string;
  active: boolean;
}
