import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { walletApi } from '@/services/api/wallet';
import { handleApiError } from '@/lib/utils/handleApiError';
import { psychologistApi } from '@/services/api/psychologist';
import type { IGetPendingPayoutData } from '@/types/api/psychologist';
import { ConfirmationDialog } from '@/components/psychologist/ConfirmationDialog';
import { CalendarIcon, GroupIcon, IndianRupeeIcon, User2Icon } from 'lucide-react';
import AnimatedTitle from '@/components/animation/AnimatedTitle';


const PsychologistDashboardCards = () => {
  const [totalEarning, setTotalEarning] = useState<number>(0);
  const [pending, setPending] = useState<IGetPendingPayoutData | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const fetchWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const walletRes = await walletApi.getWallet();
      if (!walletRes.data) {
        toast.error('Something went wrong');
        return;
      }
      setTotalEarning(walletRes.data.balance || 0);
    } catch (err) {
      handleApiError(err);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const fetchPendingPayout = useCallback(async () => {
    setPendingLoading(true);
    try {
      const pendingRes = await psychologistApi.getPendingPayout();
      console.log('pendingRes: ', pendingRes);
      if (!pendingRes.data) {
        toast.error('Something went wrong');
        return;
      }
      setPending(pendingRes.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setPendingLoading(false);
    }
  }, []);

  const handleRequestPayout = async () => {
    if (!pending || pending.payoutAmount <= 0) return;
    setRequesting(true);
    try {
      await psychologistApi.requestPayout();
      toast.success('Payout request submitted successfully');
      fetchPendingPayout();
      fetchWallet();
    } catch (err) {
      handleApiError(err);
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchPendingPayout();
  }, [fetchWallet, fetchPendingPayout]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-100">
      <AnimatedTitle>
        <h2 className="text-3xl font-bold mb-6 text-left">My Earnings</h2>
      </AnimatedTitle>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Total Earnings Card */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-green-300/50">
            <div className="flex items-center space-x-3">
              <IndianRupeeIcon className="h-7 w-7 text-green-700" />
              <h3 className="text-lg font-medium text-gray-800">Total Earnings</h3>
            </div>
            <div className="mt-3">
              {walletLoading ? (
                <div className="animate-pulse h-8 w-32 bg-green-300/30 rounded-md"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">₹{totalEarning}</p>
              )}
            </div>
          </div>

          {/* Total Consultations Card */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-purple-300/50">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-7 w-7 text-purple-700" />
              <h3 className="text-lg font-medium text-gray-800">Total Consultations</h3>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-gray-900">{0}</p>
            </div>
          </div>

          {/* Total Patients Card */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-blue-300/50">
            <div className="flex items-center space-x-3">
              <User2Icon className="h-7 w-7 text-blue-700" />
              <h3 className="text-lg font-medium text-gray-800">Total Patients</h3>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-gray-900">{0}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">Pending Payout</h3>
            <div className="mt-5"> 
              {pendingLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse h-5 w-full max-w-xs bg-gray-200/50 rounded-md"></div>
                  ))}
                </div>
              ) : pending && (pending.totalAmount > 0 || pending.consultationCount > 0) ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 max-w-lg">
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Total Amount</span>
                      <span className="text-sm font-semibold text-gray-900">₹{pending.totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Commission</span>
                      <span className="text-sm font-semibold text-red-500">−₹{pending.commissionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Payout Amount</span>
                      <span className="text-sm font-semibold text-green-500">₹{pending.payoutAmount}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Eligible Consultations</span>
                      <span className="text-sm font-semibold text-gray-900">{pending.consultationCount}</span>
                    </div>
                  </div>
                  {pending && pending.payoutAmount > 0 && (
                    <ConfirmationDialog
                      trigger={
                        <button
                          disabled={requesting}
                          className={`w-full max-w-md mt-5 py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                            requesting
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                          }`}
                        >
                          {requesting ? 'Requesting...' : 'Request Payout'}
                        </button>
                      }
                      title="Confirm Payout Request"
                      description={`You are about to request a payout of ₹${pending.payoutAmount}. This action will process the pending amount.`}
                      confirmLabel="Request Payout"
                      cancelLabel="Cancel"
                      onConfirm={handleRequestPayout}
                      loading={requesting}
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center text-sm py-4">No pending payout available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboardCards;
