import { useCallback, useEffect, useState } from 'react';
import { type IGetAllPsychologistsDto } from '@/types/dtos/psychologist';
import { toast } from 'react-toastify';
import { adminApi } from '@/server/api/admin';
import UserFilters from './UserFilter';
import ReusableTable from './ReusableTable';
import CustomPagination from './CustomPagination';
import ConfirmModal from '../ConfirmModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';

const PsychologistTable = () => {
  const [psychologists, setPsychologists] = useState<IGetAllPsychologistsDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchPsychologists = useCallback(async () => {
    try {
      const res = await adminApi.getAllPsychologists({
        page: currentPage,
        limit: itemsPerPage,
        gender: gender || undefined,
        search: debouncedSearch,
        sort: sortOrder,
      });

      if (!res.data) {
        toast.error('Something went wrong');
        return;
      }

      setPsychologists(res.data.psychologists);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (error) {
      handleApiError(error);
    }
  }, [currentPage, debouncedSearch, sortOrder, gender]);

  useEffect(() => {
    fetchPsychologists();
  }, [fetchPsychologists]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleBlockClick = (userId: string, currentlyActive: boolean) => {
    setSelectedUserId(userId);
    setIsBlocking(currentlyActive);
    setModalOpen(true);
  };

  const confirmBlockUnblock = async () => {
    try {
      if (!selectedUserId) return;

      const newStatus = isBlocking ? 'inactive' : 'active';
      const res = await adminApi.toggleUserStatus(selectedUserId, { status: newStatus });
      toast.success(res.message);
      setModalOpen(false);

      setPsychologists(prev =>
        prev.map(psychologist =>
          psychologist.user.id === selectedUserId
            ? { ...psychologist, user: { ...psychologist.user, isActive: newStatus === 'active' } }
            : psychologist
        )
      );
    } catch (err) {
      handleApiError(err);
    }
  };

  const columns = [
    {
      header: '',
      render: (p: IGetAllPsychologistsDto) => (
        <div>
          {p.user.profileImage ? (
            <img
              src={getCloudinaryUrl(p.user.profileImage) || undefined}
              alt={`${p.user.name}'s profile`}
              className="w-8 h-8 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-800" />
          )}
        </div>
      ),
      className: 'px-6 py-4',
    },
    {
      header: 'ID',
      render: (p: IGetAllPsychologistsDto) => p.id,
      className: 'px-6 py-4',
    },
    {
      header: 'Name',
      render: (p: IGetAllPsychologistsDto) => p.user.name,
      className: 'px-6 py-4',
    },
    {
      header: 'Email',
      render: (p: IGetAllPsychologistsDto) => p.user.email,
      className: 'px-6 py-4',
    },
    {
      header: 'Fee',
      render: (p: IGetAllPsychologistsDto) => `${p.defaultFee} $`,
      className: 'px-6 py-4',
    },
    {
      header: 'Action',
      render: (p: IGetAllPsychologistsDto) => (
        <button
          onClick={() => handleBlockClick(p.user.id, p.user.isActive!)}
          className={`py-1 px-3 rounded-full ${
            p.user.isActive ? 'bg-red-900/50 text-red-400' : 'bg-green-900/60 text-green-400'
          }`}
        >
          {p.user.isActive ? 'Block' : 'Unblock'}
        </button>
      ),
      className: 'px-6 py-4',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Psychologist Management</h2>
      <UserFilters
        search={searchTerm}
        setSearch={setSearchTerm}
        sort={sortOrder}
        setSort={setSortOrder}
        gender={gender}
        setGender={setGender}
        setCurrentPage={setCurrentPage}
      />
      <ReusableTable
        data={psychologists}
        columns={columns}
        emptyMessage="No users found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmBlockUnblock}
        message={`Are you sure you want to ${isBlocking ? 'block' : 'unblock'} the user?`}
      />
    </div>
  );
};

export default PsychologistTable;
