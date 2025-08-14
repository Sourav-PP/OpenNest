import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../lib/validations/user/signupValidation';
import type { SignupData } from '../../lib/validations/user/signupValidation';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { authApi } from '../../server/api/auth';
import OtpModal from './OtpModal';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'psychologist' | 'admin';
  exp: number;
  iat: number;
}

const SignupForm = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = (searchParams.get('role') ?? 'user') as 'user' | 'psychologist';

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupToken, setSignupToken] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    try {
      const formData = new FormData();
  
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('role', roleFromUrl);
      
      if(data.profileImage && data.profileImage.length > 0) {
        formData.append('file', data.profileImage[0]);
      }

      const res = await authApi.preSignuup(formData);
      setSignupToken(res.signupToken);
      setEmail(data.email);
      await authApi.sendOtp({email: data.email});
      setShowOtpModal(true);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(
        'Signup failed: ' + error?.response?.data?.error || 'Something went wrong'
      );
    }
  };

  const handleSuccess = async (accessToken: string) => {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    dispatch(loginSuccess({
      accessToken,
      email: decoded.email,
      role: decoded.role,
      userId: decoded.userId,
      isSubmittedVerification: false
    }));
    navigate(decoded.role === 'psychologist' ? '/psychologist/verification' : '/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      {/* Name Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.user} alt="" />
          <input
            {...register('name')}
            placeholder="Name"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.name?.message ?? ''}
        </p>
      </div>

      {/* Email Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.mail} alt="" />
          <input
            {...register('email')}
            placeholder="Email"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.email?.message ?? ''}
        </p>
      </div>

      {/* Phone Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.phone} alt="" />
          <input
            {...register('phone')}
            placeholder="Phone"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.phone?.message ?? ''}
        </p>
      </div>

      {/* Profile Image Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.image} alt="" />
          <input
            type="file"
            accept="image/*"
            {...register('profileImage')}
            className="w-full text-white text-center file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-gray-400 file:text-white file:hover:bg-gray-500 file:transition-colors"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.profileImage?.message ?? ''}
        </p>
      </div>


      {/* Password Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.lock} alt="" />
          <input
            type="password"
            {...register('password')}
            placeholder="Password"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.password?.message ?? ''}
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.lock} alt="" />
          <input
            type="password"
            {...register('confirmPassword')}
            placeholder="Confirm Password"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
          {errors.confirmPassword?.message ?? ''}
        </p>
      </div>

      {/* Submit Button */}
      <div className="group text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary group-hover:animate-glow-ring"
        >
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
      </div>
      <p className="text-center">Already have an account?<span className="text-[#70A5FF] cursor-pointer" onClick={() => navigate(`/login?role=${roleFromUrl ?? 'user'}`)}> Login</span></p>
      <OtpModal
        isOpen = {showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={email}
        signupToken={signupToken}
        onSuccess={handleSuccess}
      />
    </form>
  );
};

export default SignupForm;
