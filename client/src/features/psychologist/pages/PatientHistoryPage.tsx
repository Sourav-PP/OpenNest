import Sidebar from '@/components/psychologist/Sidebar';
import Header from '@/components/psychologist/Header';
import PatientHistoryTable from '../components/PatientHistoryTable';

const PatientHistoryPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <PatientHistoryTable />
      </div>
    </div>
  );
};

export default PatientHistoryPage;
