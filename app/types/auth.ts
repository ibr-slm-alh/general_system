// app/types/auth.ts
export interface Permission {
  id: number;
  name: string;
  group: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  permissoins: Permissions[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    permissions: Permissions[];
    token: AuthToken;
  };
  errors: string;
  message: string;
  status: number;
}
