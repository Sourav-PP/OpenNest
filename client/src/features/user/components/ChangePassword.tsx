import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import {
  changePasswordSchema,
  type changePasswordData,
} from '@/lib/validations/user/changePassword';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/utils/handleApiError';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Eye, EyeClosed, Lock } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPass, setCurrentShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const form = useForm<changePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: changePasswordData) => {
    try {
      setLoading(true);
      
      const res = await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success(res.message);
      form.reset();
      navigate('/user/change-password');
    } catch (err) {
      handleApiError(err, form.setError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-gray-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-3 tracking-tight text-start">
          Change password
        </h2>
      </AnimatedTitle>
      <p className="mb-6 sm:mb-8 text-gray-600 text-sm sm:text-lg max-w-2xl">
        Update your password to keep your account safe
      </p>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-50 hover:shadow-2xl transition-shadow duration-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Profile Image and Personal Info */}
            <div className="flex flex-col items-start gap-6 sm:gap-8">
              {/* current password */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-1 gap-6 sm:gap-6">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          leftIcon={Lock}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setCurrentShowPass(prev => !prev)}
                              className="p-1"
                            >
                              {showCurrentPass ? <Eye className='text-slate-400' /> : <EyeClosed className='text-slate-400' />}
                            </button>
                          }
                          type={showCurrentPass ? 'type' : 'password'}
                          placeholder="Enter your current password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          leftIcon={Lock}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowNewPass(prev => !prev)}
                              className="p-1"
                            >
                              {showNewPass ? <Eye className='text-slate-400' /> : <EyeClosed className='text-slate-400' />}
                            </button>
                          }
                          type={showNewPass ? 'type' : 'password'}
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          leftIcon={Lock}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(prev => !prev)}
                              className="p-1"
                            >
                              {showConfirmPass ? <Eye className='text-slate-400' /> : <EyeClosed className='text-slate-400' />}
                            </button>
                          }
                          type={showConfirmPass ? 'type' : 'password'}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="group flex justify-end pt-4 sm:pt-6">
              <Button
                type="submit"
                className="btn-primary group-hover:animate-glow-ring rounded-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
