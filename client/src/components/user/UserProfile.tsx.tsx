import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfileSchema, type updateProfileData } from "../../lib/validations/user/updateUserProfileValidaton";
import { zodResolver } from "@hookform/resolvers/zod";
import { userApi } from "../../server/api/user";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema)
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await userApi.getProfile()
        const profileData = res
        setValue("name", profileData.name);
        setValue("email", profileData.email);
        setValue("phone", profileData.phone);
        setValue("dateOfBirth", profileData.dateOfBirth);
        setValue("gender", profileData.gender);
        setProfileImagePreview(profileData.profileImage || null);
      } catch (error) {
        toast.error("Error fetching profile");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [setValue]);

  const onSubmit = async (data: updateProfileData) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name)
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if(data.dateOfBirth) {
        formData.append("dateOfBirth", data.dateOfBirth);
      }
      if(data.gender) {
        formData.append("gender", data.gender);
      }

      const file = data.profileImage?.[0]
      if(file) {
        formData.append('file', file)
      }
      console.log("Sending to backend:", [...formData.entries()]);

      await userApi.updateProfile(formData)

      toast.success("Profile updated successfully");
      navigate('/user/profile');
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#e9f1f4] to-[#f3feff] min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h2>
      <p className="mb-6 text-gray-500 sm:text-lg text-sm">Update your personal information to keep your account current</p>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}  className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden ring-2 ring-blue-200 transition-all group-hover:ring-blue-300">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-10 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-2a3 3 0 100-6 3 3 0 000 6zm-5 5s-1 2-1 4h12s-1-2-1-4H7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e);
                    if (e.target.files?.[0]) {
                      const fileList = e.target.files;
                      setValue("profileImage", fileList, { shouldValidate: true });
                    }
                  }}
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon lucide-camera">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
                </svg>  

              </label>
              {errors.profileImage && (
                <p className="text-red-500 text-xs mt-2 text-center">{errors.profileImage.message}</p>
              )}
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 p-3 bg-gray-50"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 p-3 bg-gray-50"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    {...register("phone")}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 p-3 bg-gray-50"
                    placeholder="Enter your mobile number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 p-3 bg-gray-50"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 p-3 bg-gray-50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;