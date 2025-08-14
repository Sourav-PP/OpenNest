import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'flatpickr/dist/themes/material_blue.css';
import { psychologistApi } from '../../server/api/psychologist';
import { updatePsychologistSchema, type updatePsychologistData } from '../../lib/validations/psychologist/updatePsychologistValidation';
import { useNavigate } from 'react-router-dom';
import AnimatedTitle from '../animation/AnimatedTitle';

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updatePsychologistData>({
    resolver: zodResolver(updatePsychologistSchema)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await psychologistApi.getProfile();

        setValue('name', profileRes.name);
        setValue('email', profileRes.email);
        setValue('phone', profileRes.phone!);
        setValue('dateOfBirth', profileRes.dateOfBirth);
        setValue('gender', profileRes.gender);
        setValue('defaultFee', profileRes.defaultFee);
        setValue('aboutMe', profileRes.aboutMe);
        setProfileImagePreview(profileRes.profileImage || null);
      } catch (error) {
        console.log('error fetchi profile update page: ', error);
        toast.error('Error fetching profile or specializations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: updatePsychologistData) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('defaultFee', data.defaultFee.toString());
      formData.append('aboutMe', data.aboutMe);
      if(data.dateOfBirth) {
        formData.append('dateOfBirth', data.dateOfBirth);
      }
      if(data.gender) {
        formData.append('gender', data.gender);
      }

      const file = data.profileImage?.[0];
      if(file) {
        formData.append('file', file);
      }
      console.log('Sending to backend:', [...formData.entries()]);

      await psychologistApi.updatePsychologistProfile(formData);
      toast.success('Profile updated successfully');
      navigate('/psychologist/edit-profile');
        
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return (
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
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <AnimatedTitle><h2 className="text-3xl font-bold text-gray-800 mb-4 text-start">Edit Profile</h2></AnimatedTitle>
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden ring-2 ring-gray-200 transition-all group-hover:ring-indigo-300">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-2a3 3 0 100-6 3 3 0 000 6zm-5 5s-1 2-1 4h12s-1-2-1-4H7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-indigo-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-indigo-600 transition-colors duration-200 shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e);
                    if (e.target.files?.[0]) {
                      const fileList = e.target.files;
                      setValue('profileImage', fileList, { shouldValidate: true });
                    }
                  }}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-camera"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </label>
              {errors.profileImage && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            <div className="flex-1 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Psychologist Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Fees
                  </label>
                  <input
                    type="number"
                    {...register('defaultFee')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="e.g. 500"
                  />
                  {errors.defaultFee && (
                    <p className="text-red-500 text-xs mt-1">{errors.defaultFee.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <textarea
                  {...register('aboutMe')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all h-24 resize-none"
                  placeholder="Describe yourself and your approach..."
                />
                {errors.aboutMe && (
                  <p className="text-red-500 text-xs mt-1">{errors.aboutMe.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditProfileForm;