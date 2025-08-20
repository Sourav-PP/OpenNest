import { useState } from 'react';
import { FiStar, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const psychologists = [
  { id: 1, name: 'Dr. Ramesh Iyer', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 2, name: 'Dr. Rekha Menon', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 3, name: 'Dr. Ramesh Iyer', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 4, name: 'Dr. Rekha Menon', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 5, name: 'Dr. Ramesh Iyer', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 6, name: 'Dr. Rekha Menon', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
  { id: 7, name: 'Dr. Ramesh Iyer', specialization: 'Anxiety, Stress', rating: 4.8, consultations: 200, earnings: '₹24000' },
];

const TopPsychologistTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(psychologists.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginatedData = psychologists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Top Psychologists</h2>
      <div className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead className="bg-admin-bg-primary text-gray-300">
              <tr>
                <th className="px-6 py-4 text-left font-bold">ID</th>
                <th className="px-6 py-4 text-left font-bold">Psychologist</th>
                <th className="px-6 py-4 text-left font-bold">Specialization</th>
                <th className="px-6 py-4 text-left font-bold">Rating</th>
                <th className="px-6 py-4 text-left font-bold">Consultations</th>
                <th className="px-6 py-4 text-left font-bold">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => (
                <tr
                  key={p.id}
                  className={i % 2 === 0 ? 'bg-admin-bg-secondary' : 'bg-admin-bg-box'}
                >
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.specialization}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <FiStar className="text-yellow-400" />
                    <span>{p.rating}</span>
                  </td>
                  <td className="px-6 py-4">{p.consultations}</td>
                  <td className="px-6 py-4">{p.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedData.map((p) => (
            <div
              key={p.id}
              className="bg-transparent rounded-lg p-4 text-white"
            >
              <div className="flex justify-between">
                <span className="font-medium">ID: {p.id}</span>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400" />
                  <span>{p.rating}</span>
                </div>
              </div>
              <p className="mt-2 font-semibold">{p.name}</p>
              <p className="text-gray-300 text-sm">{p.specialization}</p>
              <div className="mt-2 text-sm">
                <p>Consultations: {p.consultations}</p>
                <p>Earnings: {p.earnings}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 backdrop:filter-none bg-transparent border-t-2 border-admin-bg-box">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1 ? 'text-gray-500 cursor-not-allowed bg-admin-bg-box' : 'text-white bg-admin-bg-box hover:bg-gray-700'
            }`}
          >
            <FiArrowLeft size={20} className='stroke-green-700'/>
          </button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages ? 'text-gray-500 cursor-not-allowed bg-admin-bg-box' : 'text-white hover:bg-gray-700 bg-admin-bg-box'
            }`}
          >
            <FiArrowRight size={20} className='stroke-green-700'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPsychologistTable;