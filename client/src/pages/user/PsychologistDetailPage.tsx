import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import PsychologistDetailsSection from '../../components/user/PsychologistDetailsSection';
import BookingSession from '../../components/user/BookingSession';

const PsychologistDetailPage = () => {
  return (
    <>
      <Navbar />
      <PsychologistDetailsSection />
      <BookingSession/>
      <Footer />
    </>
  );
};

export default PsychologistDetailPage;
