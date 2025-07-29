import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import type { IUserDto } from '../../types/user';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { adminApi } from '../../server/api/admin';
import ConfirmModal from './ConfirmModal';


const UserTable = () => {
  const [user, setUser] = useState<IUserDto[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [gender, setGender] = useState<"Male" | "Female" | "">("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")  

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isBlocking, setIsBlocking] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(delay)
  }, [searchTerm])
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
      // setIsLoading(true)
      const data = await adminApi.getAllUser({
        page: currentPage,
        limit: itemsPerPage,
        gender: gender || undefined,
        search: debouncedSearch,
        sort: sortOrder
      })
      console.log("data: ", data)

      setUser(data.user)
      setTotalCount(data.totalCount ?? 0)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      // setIsLoading(false)
    }
    }

    fetchUser()
    
  }, [currentPage, debouncedSearch, sortOrder, gender])

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleBlockClick = (userId: string, currentlyActive: boolean) => {
    setSelectedUserId(userId)
    setIsBlocking(currentlyActive)
    setModalOpen(true)
  }

  const confirmBlockUnblock = async () => {
    try {
      if (!selectedUserId) return

      const newStatus = isBlocking ? "inactive" : "active";

      await adminApi.toggleUserStatus(selectedUserId, {status: newStatus})
      // await adminApi.toggleUserStatus(selectedUserId) // your PATCH/PUT API
      toast.success(`User ${isBlocking ? 'blocked' : 'unblocked'} successfully`)
      setModalOpen(false)

      setUser((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserId ? { ...user, isActive: !isBlocking } : user
        )
      );
      
    } catch (err) {
      console.log(err)
      toast.error("Failed to update user status")
    }
  }

  

return (
  <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
    <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>

    {/* Filters */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-admin-bg-secondary rounded-x">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-admin-bg-box text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 border border-gray-600"
        />
      </div>

      {/* Sort and Filter*/}
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-40">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full px-4 py-2 pr-8 rounded-lg bg-admin-bg-box text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down">
            <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-40">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | '')}
            className="w-full px-4 py-2 pr-8 rounded-lg bg-admin-bg-box text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-admin-bg-primary text-gray-300">
            <tr>
              <th className="px-6 py-4 text-left font-bold"></th>
              <th className="px-6 py-4 text-left font-bold">ID</th>
              <th className="px-6 py-4 text-left font-bold">Name</th>
              <th className="px-6 py-4 text-left font-bold">Email</th>
              <th className="px-6 py-4 text-left font-bold">Phone</th>
              <th className="px-6 py-4 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((u, i) => (
              <tr
                key={u.id}
                className={i % 2 === 0 ? 'bg-admin-bg-secondary' : 'bg-admin-bg-box'}
              >
                <td className="px-6 py-4">
                  <div>
                    {u.profileImage ? (
                      <img
                        src={u.profileImage}
                        alt={`${u.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                      />

                    ): (
                      <div className='w-8 h-8 rounded-full bg-gray-800'></div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{u.id}</td>
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phone}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleBlockClick(u.id, u.isActive!)}
                    className={`py-1 px-3 rounded-full bg-opacity-45 ${
                      u.isActive ? 'bg-red-700' : 'bg-green-700'
                    }`}
                  >
                    {u.isActive ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {user.map((u) => (
            <div key={u.id} className="bg-transparent rounded-lg p-4 text-white border border-gray-700">
              <p className="font-semibold">{u.name}</p>
              <p className="text-gray-300 text-sm">{u.email}</p>
              <p className="text-sm mt-2">Phone: {u.phone}</p>
              <p className="text-sm">Gender: {u.gender || '—'}</p>
              <p className="text-sm">Role: {u.role}</p>
              <p className="text-sm mt-2">
                Action:{' '}
                {u.isActive ? (
                  <button className='bg-red-700 py-0.5 px-3 rounded-full bg-opacity-45'>Block</button>
                ) : (
                  <button className='bg-green-700 py-1 px-3 rounded-full bg-opacity-45'>Unblock</button>
                )}
              </p>
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
          Page {currentPage} of {Math.max(totalPages, 1)}
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
    <ConfirmModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onConfirm={confirmBlockUnblock}
      message={`Are you sure you want to ${isBlocking ? 'block' : 'unblock'} the user?`}
    />

  </div>
);
};

export default UserTable;