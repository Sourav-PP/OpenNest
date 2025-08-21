import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordData } from '@/lib/validations/user/forgotPassword';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Mail } from 'lucide-react';


const ForgotPassword = () => {
  const location = useLocation();
  const { role } = location.state || {};
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const res = await authApi.sendOtp({email: data.email});

      toast.success(res.message);
      navigate('/verify-otp', {state: {email: data.email, role: role}});
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
              <FormControl>
                <Input leftIcon={Mail} placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className='group'>
          <Button size='lg' type="submit" className=" btn-primary group-hover:animate-glow-ring w-full rounded-lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Loading...' : 'Send OTP'}
          </Button>
        </div>

        {/* Login Link */}
        
        <p className="text-center text-sm">
          Back to login{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/login', {state: {role: role}})}
          >
            Login
          </span>
        </p>
      </form>
    </Form>
  );
};

export default ForgotPassword;