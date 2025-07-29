import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userApi } from "../../server/api/user";
import type { IPsychologistDto } from "../../types/pasychologist";
import { Link } from "react-router-dom";

const TherapistPageSection = () => {
  const [psychologists, setPsychologists] = useState<IPsychologistDto[]>([])

  useEffect(() => {
    const fetchPsychologists = async() => {
      try {
        const res = await userApi.getAllPsychologists()
        console.log('res in page: ', res)
        setPsychologists(res.psychologists)
      } catch (error) {
        toast.error("Failed to load specialization")
        console.error("Failed to fetch services:", error);
      }
    }

    fetchPsychologists()
  },[])


  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#F3F7FF] p-4 sm:p-28 sm:pt-44">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primaryText text-center">Explore Our Licensed Psychologists</h1>
        <p className="text-gray-600 mb-9 text-sm sm:text-base text-center">
          Our team of licensed psychologists is dedicated to providing personalized mental health support. Each therapist brings unique expertise and a compassionate approach to help you on your journey to better mental health.
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter the name"
                className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 lucide lucide-search-icon lucide-search">
                <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
            <select className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white">
              <option>Expertise</option>
              <option>Anxiety</option>
              <option>Stress</option>
              <option>Trauma</option>
            </select>
            <select className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white">
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white">
              <option>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
          </div>
        </div>

        {/* Therapist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {psychologists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg">
              <img src={therapist?.profileImage} alt={therapist.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <div className="flex items-center justify-between pb-3 mb-2 border-b-2">
                {/* {therapist.available && ( */}
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">Available</span>
                {/* )} */}
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">★ 4.8</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{therapist.name}</h3>
              <p className="text-blue-700 text-sm mb-1">{therapist.qualification}</p>
              <p className="text-gray-500 text-xs mb-4">{therapist.specializations.join(', ')}</p>
              <div className="group text-start">
              <Link to={`/user/psychologists/${therapist.userId}`}>
              <button
                className="btn-primary group-hover:animate-glow-ring mb-2"
              >
                View
              </button>
              </Link>
      </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapistPageSection;