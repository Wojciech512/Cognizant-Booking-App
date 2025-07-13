export interface RegisterResponse {
  id: number;
  email: string;
  createdAt: string;
}

export interface RegisterPayload {
  username: string
  email: string;
  password: string;
  password2: string;
}

export interface LoginResponse {
  access: string;
  refresh?: string;
}
