import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import PsychologistDetailsSection from '../components/PsychologistDetailsSection';
import BookingSession from '../components/BookingSession';
import UserReviewsSection from '../components/UserReviewSection';

const PsychologistDetailPage = () => {
  return (
    <>
      <Navbar />
      <PsychologistDetailsSection />
      <UserReviewsSection />
      <BookingSession />
      <Footer />
    </>
  );
};

export default PsychologistDetailPage;
