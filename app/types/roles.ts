export interface Permission {
  id: number;
  name: string;
  group: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  permissions: Permission[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string;
  message: string;
  status: number;
}
