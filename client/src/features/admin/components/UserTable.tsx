import { useCallback, useEffect, useState } from 'react';
import type { IUserDto } from '@/types/dtos/user';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import Filters from '@/components/admin/Filters';
import { UserGenderFilter, type UserGenderFilterType } from '@/constants/User';
import { SortFilter, type SortFilterType } from '@/constants/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';

const UserTable = () => {
  const [users, setUsers] = useState<IUserDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    search: string;
    gender: UserGenderFilterType;
    sort: SortFilterType;
  }>({
    search: '',
    gender: UserGenderFilter.ALL,
    sort: SortFilter.Desc,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [filters.search]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminApi.getAllUser({
        page: currentPage,
        limit: itemsPerPage,
        gender: filters.gender || undefined,
        search: debouncedSearch,
        sort: filters.sort,
      });

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setUsers(res.data.user);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (err) {
      handleApiError(err);
    }
  }, [currentPage, debouncedSearch, filters.sort, filters.gender]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      setModalOpen(false);
      toast.success(res.message);

      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUserId ? { ...user, isActive: newStatus === 'active' ? true : false } : user
        )
      );
    } catch (err) {
      handleApiError(err);
    }
  };

  const columns = [
    {
      header: '',
      render: (u: IUserDto) => (
        <div>
          {u.profileImage ? (
            <img
              src={getCloudinaryUrl(u.profileImage) || undefined}
              alt={`${u.name}'s profile`}
              loading="lazy"
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
      header: 'Name',
      render: (u: IUserDto) => u.name,
      className: 'px-6 py-4',
    },
    {
      header: 'Email',
      render: (u: IUserDto) => u.email,
      className: 'px-6 py-4',
    },
    {
      header: 'Phone',
      render: (u: IUserDto) => u.phone || 'N/A',
      className: 'px-6 py-4',
    },
    {
      header: 'Action',
      render: (u: IUserDto) => (
        <button
          onClick={() => handleBlockClick(u.id, u.isActive!)}
          className={`py-1 px-3 rounded-full ${
            u.isActive ? 'bg-red-900/50 text-red-400' : 'bg-green-900/60 text-green-400'
          }`}
        >
          {u.isActive ? 'Block' : 'Unblock'}
        </button>
      ),
      className: 'px-6 py-4',
    },
  ];

  const userFilterConfig = [
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Search by name or email',
    },
    {
      type: 'select' as const,
      key: 'sort',
      placeholder: 'Sort by',
      options: [
        { label: 'Newest First', value: 'desc' },
        { label: 'Oldest First', value: 'asc' },
      ],
    },
    {
      type: 'select' as const,
      key: 'gender',
      placeholder: 'Filter by gender',
      options: [
        { label: 'All Genders', value: UserGenderFilter.ALL },
        { label: 'Male', value: UserGenderFilter.MALE },
        { label: 'Female', value: UserGenderFilter.FEMALE },
      ],
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
      <Filters
        config={userFilterConfig}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        resetPage={() => setCurrentPage(1)}
      />
      <ReusableTable
        data={users}
        columns={columns}
        emptyMessage="No users found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
