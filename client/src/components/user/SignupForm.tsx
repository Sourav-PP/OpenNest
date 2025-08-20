import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../lib/validations/user/signupValidation';
import type { SignupData } from '../../lib/validations/user/signupValidation';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { authApi } from '../../server/api/auth';
import OtpModal from './OtpModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { Button } from '../ui/button';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'psychologist' | 'admin';
  exp: number;
  iat: number;
}

const SignupForm = () => {
  const location = useLocation();
  const { role } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupToken, setSignupToken] = useState('');
  const [email, setEmail] = useState('');

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      profileImage: undefined,
    },
  });

  const handleSuccess = async (accessToken: string) => {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    dispatch(
      loginSuccess({
        accessToken,
        email: decoded.email,
        role: decoded.role,
        userId: decoded.userId,
        isSubmittedVerification: false,
      })
    );

    navigate(decoded.role === 'psychologist' ? '/psychologist/verification' : '/');
  };

  const onSubmit = async (data: SignupData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('role', role);

      if (data.profileImage && data.profileImage.length > 0) {
        formData.append('file', data.profileImage[0]);
      }

      //pre-signup api
      const res = await authApi.preSignup(formData);

      if (!res.data) {
        toast.error('Something went wrong, Please try again');
        return;
      }
      setSignupToken(res.data.signupToken);
      setEmail(data.email);

      // send OTP
      const otpRes = await authApi.sendOtp({ email: data.email });
      toast.success(otpRes.message);
      setShowOtpModal(true);
    } catch (err) {
      handleApiError(err, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input leftIcon={User} placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input leftIcon={Mail} placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input leftIcon={Phone} placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Image */}
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => field.onChange(e.target.files)}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={form.formState.isSubmitting}
                  className="block p-1.5 w-full text-sm text-gray-300
             file:mr-4 file:py-1 file:px-4
             file:rounded-full file:border-0
             file:bg-gray-400 file:text-white
             file:hover:bg-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" leftIcon={Lock} placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" leftIcon={Lock} placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="group text-center">
          <Button
            type="submit"
            className="btn-primary group-hover:animate-glow-ring w-full rounded-lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Signing up...' : 'Signup'}
          </Button>
        </div>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/login', {state: {role: role}})}
          >
            Login
          </span>
        </p>

        {/* OTP Modal */}
        <OtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={email}
          signupToken={signupToken}
          onSuccess={handleSuccess}
        />
      </form>
    </Form>
  );
};

export default SignupForm;
