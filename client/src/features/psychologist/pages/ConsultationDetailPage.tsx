import Sidebar from '@/components/psychologist/Sidebar';
import Header from '@/components/psychologist/Header';
import PsychologistConsultationsDetail from '../components/PsychologistConsultationsDetail';

const ConsultationDetailPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <PsychologistConsultationsDetail />
      </div>
    </div>
  );
};

export default ConsultationDetailPage;

