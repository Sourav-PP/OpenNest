import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type { BackendFieldError } from '@/types/api/api';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export const handleApiError = <T extends FieldValues>(err: unknown, setError?: UseFormSetError<T>) => {
  const error = err as AxiosError<{
    success: false;
    message: string;
    errors: BackendFieldError[];
  }>;

  // filed level error validation
  if (error.response?.status === 422 && error.response.data?.errors && setError) {
    error.response.data.errors.forEach(e => {
      const field = e.field as Path<T>;
      setError(field, { type: 'manual', message: e.message });
    });
  }

  // Show general error toast
  const message =
    error.response?.data?.message || (error.response ? `HTTP ${error.response.status} Error` : 'Network error');
  toast.error(message);
};
