import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginData } from '@/lib/validations/user/loginValidation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';
import { authApi } from '@/services/api/auth';
import GoogleLoginButton from './GoogleLoginButton';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Lock, Mail } from 'lucide-react';
import { walletApi } from '@/services/api/wallet';



interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'psychologist' | 'admin';
  exp: number;
  iat: number;
}

const LoginForm = () => {
  const location = useLocation();
  const { role } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigateAfterLogin = (role: string, hasSubmittedVerificationForm?: boolean) => {
    if (role === 'psychologist') {
      navigate(hasSubmittedVerificationForm ? '/psychologist/profile' : '/psychologist/verification');
    } else {
      navigate('/');
    };
  };

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await authApi.login(data);

      if (!res.data) {
        toast.error('No data received from server');
        return;
      }
      const decoded = jwtDecode<TokenPayload>(res.data.accessToken);

      dispatch(
        loginSuccess({
          accessToken: res.data.accessToken,
          email: res.data.user.email,
          role: res.data.user.role,
          userId: decoded.userId,
          isSubmittedVerification: res.data.hasSubmittedVerificationForm,
        })
      );

      if(role === 'user') {
        try {
          await walletApi.create();
        } catch (error) {
          console.log('error: ', error);
          console.log('sdfoisdfo jjj');
          handleApiError(error);
        }
      }

      toast.success(res.message);
      navigateAfterLogin(res.data.user.role, res.data.hasSubmittedVerificationForm);
    } catch (err) {
      handleApiError(err, form.setError);
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
                <Input leftIcon={Mail} placeholder="Enter your email" {...field} />
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
                <Input leftIcon={Lock} type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className='group'>
          <Button size='lg' type="submit" className=" btn-primary group-hover:animate-glow-ring w-full rounded-lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </div>

        {/* Google Login */}
        <GoogleLoginButton />

        {/* Signup Link */}
        
        <p className="text-center text-sm">
          <p
            className="text-center text-sm text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/forgot-password', {state: {role: role}})}
          >
            Forgot Password
          </p>
          Don't have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/signup', {state: {role: role}})}
          >
            Sign up
          </span>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;