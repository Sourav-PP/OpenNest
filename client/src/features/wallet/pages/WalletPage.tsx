'use client';

import { useEffect, useState } from 'react';
import WalletBalance from '../components/WalletBalance';
import WalletTransactions from '../components/WalletTransactions';
import AddFundsModal from '../components/AddFundsModal';
import { walletApi } from '@/services/api/wallet';
import type { IWallet, IWalletTransaction } from '@/types/dtos/wallet';
import { toast } from 'react-toastify';
import Header from '@/components/user/Header';
import Sidebar from '@/components/user/Sidebar';

const WalletPage = () => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await walletApi.getWallet();
      console.log('data: ', res.data);
      if(!res.data) {
        toast.error('Something went wrong');
        return;
      }
      setWallet(res.data);
      if (res.data.id) {
        const transactionRes = await walletApi.listTransactions(res.data.id);

        if(!transactionRes.data) {
          toast.error('Something went wrong');
          return;
        }
        console.log('tsx: ', transactionRes.data.transactions);
        setTransactions(transactionRes.data.transactions);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch wallet data');
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <div className="max-w-3xl mx-auto p-6">
          {wallet && (
            <WalletBalance
              balance={wallet.balance}
              currency={wallet.currency}
              onAddFunds={() => setShowModal(true)}
            />
          )}

          <WalletTransactions transactions={transactions} />

          <AddFundsModal open={showModal} onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
    
  );
};

export default WalletPage;
