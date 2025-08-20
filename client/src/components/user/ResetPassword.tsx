import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/server/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Mail } from 'lucide-react';
import { z } from 'zod';


const ResetPassword = () => {
  const location = useLocation();
  const { role, email } = location.state || {};
  const navigate = useNavigate();

  const verifyResetPassSchema = z.object({
    password: z
      .string()
      .trim()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().trim().min(6),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path:['confirmPassword']
  });

  type VerifyResetPassData = z.infer<typeof verifyResetPassSchema>

  const form = useForm<VerifyResetPassData>({
    resolver: zodResolver(verifyResetPassSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
  });

  const onSubmit = async (data: VerifyResetPassData) => {
    try {
      const res = await authApi.resetPassword({email, password: data.password});

      toast.success(res.message);
      navigate('/login', {state: { role: role }});
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' leftIcon={Mail} placeholder="Enter the password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' leftIcon={Mail} placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className='group'>
          <Button size='lg' type="submit" className=" btn-primary group-hover:animate-glow-ring w-full rounded-lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Loading...' : 'Reset Password'}
          </Button>
        </div>

        {/* Login Link */}
        
        <p className="text-center text-sm">
          Back to login{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/login', {state: { role: role }})}
          >
            Login
          </span>
        </p>
      </form>
    </Form>
  );
};

export default ResetPassword;