import { useServices, type Service } from '@/hooks/useServices';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
// import {PencilIcon, Trash } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { adminApi } from '@/services/api/admin';
import { Trash } from 'lucide-react';

const ServiceTable = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { services, loading, currentPage, setCurrentPage, totalPage, refetch } = useServices(debouncedSearch);

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    
    return () => clearTimeout(delay);
  }, [searchTerm, setCurrentPage]);  

  const openDeleteModal = async (id: string) => {
    setSelectedServiceId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedServiceId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteService(selectedServiceId);
      toast.success('Service deleted successfully');
      setModalOpen(false);
      setSelectedServiceId(null);
      refetch();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Image',
      render: (s: Service) => (
        <div>
          {s.id ? (
            <img
              src={getCloudinaryUrl(s.bannerImage) || undefined}
              alt={`${s.name}'s banner image`}
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
      render: (s: Service) => s.id,
      className: 'px-6 py-4',
    },
    {
      header: 'Name',
      render: (s: Service) => s.name,
      className: 'px-6 py-4',
    },
    {
      header: 'Description',
      render: (s: Service) => s.description,
      className: 'px-6 py-4',
    },
    {
      header: 'Actions',
      render: (s: Service) => (
        <div className="flex gap-2">
          {/* <button onClick={() => console.log('Update', s)}>
            <PencilIcon className='text-slate-400 h-5'/>
          </button> */}
          <button onClick={() => openDeleteModal(s.id)}>
            <Trash className="text-red-500 h-5" />
          </button>
        </div>
      ),
      className: 'px-6 py-4',
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-admin-bg-secondary">
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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">All Service</h2>
      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 rounded-lg border border-gray-600 bg-admin-bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ReusableTable
        data={services}
        columns={columns}
        emptyMessage="No users found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service?"
        message={'Are you sure you want to delete this service? This action cannot be undone.'}
      />
    </div>
  );
};

export default ServiceTable;
