import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import CustomPagination from '@/components/user/CustomPagination';
import { usePsychologists } from '@/hooks/usePsychologists';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { UserGenderFilter, type UserGenderFilterType } from '@/constants/User';
import { SortFilter, type SortFilterType } from '@/constants/SortFilter';

const TherapistPageSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gender, setGender] = useState<UserGenderFilterType>(UserGenderFilter.ALL);
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Desc);
  const [expertise, setExpertise] = useState<string>('all');

  const itemsPerPage = 8;

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const { psychologists, totalCount, loading } = usePsychologists({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    gender,
    sort,
    expertise,
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading)
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
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 to-white p-4 sm:p-8 md:p-12 lg:p-16 xl:pt-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primaryText mb-4 text-center tracking-tight">
          Meet Our Licensed Psychologists
        </h1>
        <p className="text-gray-500 mb-8 font-extralight sm:text-lg text-center max-w-2xl mx-auto leading-relaxed">
          Connect with our compassionate team of licensed psychologists, each offering unique expertise to support your
          mental health journey.
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:gap-6">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-1 sm:gap-3">
            <select
              value={expertise}
              onChange={e => {
                setExpertise(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all duration-300 shadow-sm hover:shadow-md appearance-none"
            >
              <option value="all">All Expertise</option>
              <option value="anxiety">Anxiety</option>
              <option value="stress">Stress</option>
              <option value="depression">Depression</option>
            </select>
            <select
              value={gender}
              onChange={e => {
                setGender(e.target.value as UserGenderFilterType);
                setCurrentPage(1);
              }}
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all duration-300 shadow-sm hover:shadow-md appearance-none"
            >
              <option value={UserGenderFilter.ALL}>All Genders</option>
              <option value={UserGenderFilter.MALE}>Male</option>
              <option value={UserGenderFilter.FEMALE}>Female</option>
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'asc' | 'desc')}
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all duration-300 shadow-sm hover:shadow-md appearance-none"
            >
              <option value={SortFilter.Desc}>Sort by Price</option>
              <option value={SortFilter.Asc}>Low to High</option>
              <option value={SortFilter.Desc}>High to Low</option>
            </select>
          </div>
        </div>

        {/* Therapist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {psychologists.map(therapist => (
            <div
              key={therapist.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fadeIn"
            >
              <img
                src={getCloudinaryUrl(therapist?.profileImage) || undefined}
                alt={therapist.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Available
                </span>
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ★ 4.8
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{therapist.name}</h3>
              <p className="text-green-600 text-sm mb-2 font-medium">{therapist.qualification}</p>
              <p className="text-gray-500 text-xs mb-4 line-clamp-2">{therapist.specializations.join(', ')}</p>
              <div className="group">
                <Link to={`/user/psychologists/${therapist.userId}`}>
                  <button className="btn-primary group-hover:animate-glow-ring mb-2">View Profile</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10">
          <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default TherapistPageSection;
