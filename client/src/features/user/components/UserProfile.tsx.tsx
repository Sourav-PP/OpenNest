import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { updateProfileSchema, type updateProfileData } from '@/lib/validations/user/updateUserProfileValidation';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import AnimatedTitle from '@/components/animation/AnimatedTitle';

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const form = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: undefined,
      profileImage: undefined,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();

        if(!res.data) {
          toast.error('Something went wrong');
          return;
        }

        form.reset({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : '',
          gender: res.data.gender,
        });
        setProfileImagePreview(getCloudinaryUrl(res.data.profileImage));
      } catch (err) {
        handleApiError(err, form.setError);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onSubmit = async (data: updateProfileData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.gender) formData.append('gender', data.gender);

      const file = data.profileImage?.[0];
      if (file) formData.append('file', file);

      const res = await userApi.updateProfile(formData);
      toast.success(res.message);
      navigate('/user/profile');
    } catch (err) {
      handleApiError(err, form.setError);
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
      <AnimatedTitle><h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-3 tracking-tight text-start">My Profile</h2></AnimatedTitle>
      <p className="mb-6 sm:mb-8 text-gray-600 text-sm sm:text-lg max-w-2xl">
        Keep your personal information up to date to ensure your account stays current
      </p>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-50 hover:shadow-2xl transition-shadow duration-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Profile Image and Personal Info */}
            <div className="flex flex-col items-start gap-6 sm:gap-8">
              <div className="relative w-full max-w-[150px] sm:max-w-none">
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gray-50 rounded-2xl overflow-hidden ring-4 ring-blue-100 shadow-sm relative">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium">
                      No Image
                    </div>
                  )}
                  <label className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 sm:p-3 cursor-pointer hover:bg-blue-600 shadow-md transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfileImagePreview(URL.createObjectURL(file));
                          form.setValue('profileImage', e.target.files as FileList, { shouldValidate: true });
                        }
                      }}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>
                </div>
                <FormMessage className="text-xs sm:text-sm text-red-500 mt-2" />
              </div>

              {/* Personal Info */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field} 
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">Mobile Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your mobile number" 
                          {...field} 
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">Date of Birth</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm sm:text-base">Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                {form.formState.isSubmitting ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;
