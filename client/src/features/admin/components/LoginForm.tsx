import { useForm } from 'react-hook-form';
import { loginSchema, type LoginData } from '@/lib/validations/user/loginValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';
import { adminApi } from '@/services/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Lock, Mail } from 'lucide-react';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'psychologist' | 'admin';
  exp: number;
  iat: number;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async(data: LoginData) => {
    try {
      const res = await adminApi.login(data);
      const { accessToken } = res;
      const decoded = jwtDecode<TokenPayload>(accessToken);
            
      dispatch(
        loginSuccess({
          accessToken,
          email: decoded.email,
          role: decoded.role,
          userId: decoded.userId
        })
      );

      toast.success('Login successful');
            
      navigate('/admin/dashboard');
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input leftIcon={Mail} placeholder="Enter your email" className='bg-admin-bg-secondary border-none hover:bg-admin-bg-secondary' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input leftIcon={Lock} type="password" placeholder="Enter your password" className='bg-admin-bg-secondary border-none hover:bg-admin-bg-secondary' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="group">
          <Button
            size="lg"
            type="submit"
            className="btn-primary group-hover:animate-glow-ring w-full rounded-lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
