import Sidebar from '@/components/psychologist/Sidebar';
import Header from '@/components/psychologist/Header';
import PsychologistConsultationHistoryTable from '../components/PsychologistConsultationHistoryTable';

const PsychologistConsultationHistoryPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <PsychologistConsultationHistoryTable />
      </div>
    </div>
  );
};

export default PsychologistConsultationHistoryPage;
