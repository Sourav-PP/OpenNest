import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Mail } from 'lucide-react';
import { z } from 'zod';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';

const VerifyOtp = () => {
  const location = useLocation();
  const { role, email } = location.state || {};
  const navigate = useNavigate();

  const verifyOtpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
  });

  type VerifyOtpData = z.infer<typeof verifyOtpSchema>;

  const form = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data: VerifyOtpData) => {
    try {
      const res = await authApi.verifyForgotOtp({ email, otp: data.otp });

      toast.success(res.message);
      navigate(publicFrontendRoutes.resetPassword, { state: { email: email, role: role } });
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
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input leftIcon={Mail} placeholder="Enter the otp" {...field} />
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
            className=" btn-primary group-hover:animate-glow-ring w-full rounded-lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Loading...' : 'Submit OTP'}
          </Button>
        </div>

        {/* Login Link */}

        <p className="text-center text-sm">
          Back to login{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(publicFrontendRoutes.login, { state: { role: role } })}
          >
            Login
          </span>
        </p>
      </form>
    </Form>
  );
};

export default VerifyOtp;
