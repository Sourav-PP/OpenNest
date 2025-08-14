import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userApi } from '../../server/api/user';
import type { IPsychologistDto } from '../../types/pasychologist';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import CustomPagination from './CustomPagination';

const TherapistPageSection = () => {
  const [psychologists, setPsychologists] = useState<IPsychologistDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'all'>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc'); 
  const [expertise, setExpertise] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 4;

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const fetchPsychologists = async() => {
      try {
        setLoading(true);
        const res = await userApi.getAllPsychologists({
          page: currentPage,
          limit: itemsPerPage,
          gender: gender,
          search: debouncedSearch,
          sort: sort,
          expertise: expertise !== 'all' ? expertise : undefined,
        });
        console.log('res in page: ', res);
        setPsychologists(res.psychologists);
        setTotalCount(res.totalCount ?? 0);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  },[currentPage, debouncedSearch, sort, gender, expertise]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
    <div className="min-h-screen bg-gradient-to-b bg-[#F3F7FF] p-4 sm:p-28 sm:pt-44">
      <div className="max-w-7xl mx-auto mb-6">
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
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 lucide lucide-search-icon lucide-search">
                <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
            <select
              value={expertise}
              onChange={(e) => {
                setExpertise(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white"
            >
              <option value="all">Expertise</option>
              <option value="anxiety">Anxiety</option>
              <option value="atress">Stress</option>
              <option value="depression">Trauma</option>
            </select>

            {/* gender */}
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as 'Male' | 'Female' | 'all');
                setCurrentPage(1);
              }}
              className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white">
              <option value="all">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* Price */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as 'asc' | 'desc');
              }}
              className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3EB1EB] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white">
              <option value="desc">Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
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
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TherapistPageSection;