import { useCallback, useEffect, useState } from 'react';
import type { IUserDto } from '@/types/dtos/user';
import { toast } from 'react-toastify';
import { adminApi } from '@/server/api/admin';
import UserFilters from './UserFilter';
import ReusableTable from './ReusableTable';
import CustomPagination from './CustomPagination';
import ConfirmModal from '../ConfirmModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';

const UserTable = () => {
  const [users, setUsers] = useState<IUserDto[]>([]);
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

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminApi.getAllUser({
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

      setUsers(res.data.user);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (err) {
      handleApiError(err);
    }
  }, [currentPage, debouncedSearch, sortOrder, gender]);

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
          user.id === selectedUserId
            ? { ...user, isActive: newStatus === 'active' ? true : false }
            : user
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
      render: (u: IUserDto) => u.id,
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
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
        data={users}
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

export default UserTable;
