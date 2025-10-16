import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4">
      <div className="animate-fadeInScale">
        <CheckCircle className="text-green-600 w-24 h-24 mb-6 drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-extrabold text-green-800 mb-3 tracking-tight">Payment Successful!</h1>
      <p className="text-gray-600 text-center max-w-md mb-8 text-lg leading-relaxed">
        Your booking is confirmed! We're thrilled to have you on board. Thank you for choosing our service.
      </p>
      <Link
        to="/user/consultations"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-fadeInUp"
      >
        Go to session page
      </Link>
    </div>
  );
}
