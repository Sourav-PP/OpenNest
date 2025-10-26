import { useEffect, useState, useCallback } from 'react';
import ReusableTable from '@/components/admin/ReusableTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import { actionColumn, textColumn } from '@/components/user/TableColumns';
import { generalMessages } from '@/messages/GeneralMessages';
import type { IAddPlanResponseData } from '@/types/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';

const PlanTable = () => {
  const [plans, setPlans] = useState<IAddPlanResponseData[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await adminApi.getAllPlans();
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }
      setPlans(res.data);
    } catch (err) {
      handleApiError(err);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDeleteClick = (planId: string) => {
    setSelectedPlanId(planId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlanId) return;

    try {
      const res = await adminApi.deletePlan(selectedPlanId);
      toast.success(res.message);
      setPlans(prev => prev.filter(p => p.id !== selectedPlanId));
    } catch (err) {
      handleApiError(err);
    } finally {
      setModalOpen(false);
      setSelectedPlanId(null);
    }
  };

  const columns = [
    textColumn<IAddPlanResponseData>('Name', p => p.name, 'px-6 py-4'),
    textColumn<IAddPlanResponseData>('Description', p => p.description || 'N/A', 'px-6 py-4'),
    textColumn<IAddPlanResponseData>('Price', p => `${p.price}$`, 'px-6 py-4'),
    textColumn<IAddPlanResponseData>('Credits', p => p.creditsPerPeriod.toString(), 'px-6 py-4'),
    textColumn<IAddPlanResponseData>('Billing Period', p => p.billingPeriod, 'px-6 py-4'),
    textColumn<IAddPlanResponseData>(
      'Created At',
      p => (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'),
      'px-6 py-4'
    ),
    actionColumn<IAddPlanResponseData>(
      'Action',
      p => handleDeleteClick(p.id),
      () => 'Delete',
      'px-6 py-4',
      () => 'bg-red-600 text-white hover:bg-red-700'
    ),
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Plans</h2>
      <ReusableTable
        data={plans}
        columns={columns}
        emptyMessage="No plans found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this plan?"
      />
    </div>
  );
};

export default PlanTable;
