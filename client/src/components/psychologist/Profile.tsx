import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { psychologistApi } from "../../server/api/psychologist";
import type { IPsychologistProfileDto } from "../../types/pasychologist";

const Profile = () => {
  console.log("📍 Loaded: ProfilePage component");
  const navigate = useNavigate()
  const [profile, setProfile] = useState<IPsychologistProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await psychologistApi.getProfile()
        setProfile(res);
      } catch (error) {
        toast.error("error fetching the profile");
        console.log('error fetching the profile: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!profile) return null;

  const {
    name,
    email,
    defaultFee,
    qualification,
    aboutMe,
    kycStatus,
    dateOfBirth,
    specializations,
    // experience,
    profileImage,
  } = profile;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#e9f1f4] to-[#f3feff] min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h2>
      <p className="mb-6 text-gray-500">Hi, {name}, Welcome back!</p>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-100">
        <div className="flex justify-end mb-4 sm:mb-0">
          <p
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              kycStatus === "verified"
                ? "bg-green-100 text-green-700"
                : kycStatus === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            } hidden sm:block`}
          >
            KYC Status: <span className="capitalize">{kycStatus}</span>
            {kycStatus === "verified" && " ✓"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden ring-2 ring-blue-200">
            <img src={profileImage} alt="profile_image" className="w-full h-full object-cover object-center"/>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{email}</p>
            <p className="text-sm text-gray-600">{qualification}</p>
            <p className="text-sm text-gray-600">{dateOfBirth}</p>
            <p className="text-sm text-gray-600">Fees: ${defaultFee}</p>
            <p
              className={`text-sm font-medium mt-1 sm:hidden ${
                kycStatus === "verified"
                  ? "text-green-600"
                  : kycStatus === "rejected"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              KYC Status: <span className="capitalize">{kycStatus}</span>
              {kycStatus === "verified" && " ✓"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">About Me</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{aboutMe}</p>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Specialization</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            {specializations?.map((spec: string) => (
              <li key={spec} className="ml-2">{spec}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="group text-center">
            <button
              onClick={() => navigate('/psychologist/edit-profile')}
              className="btn-primary w-full group-hover:animate-glow-ring mb-2"
            >
              Edit Profile
            </button>
          </div>
          <div className="group text-center">
            <button
              className="btn-primary w-full group-hover:animate-glow-ring mb-2"
            >
              Add Specialization Fee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;