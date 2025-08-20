export interface BackendFieldError {
  field: string;
  message: string;
}

export interface BackendResponse<T = never> {
  success: boolean;
  message: string;
  data?: T;
  errors?: BackendFieldError[];
}