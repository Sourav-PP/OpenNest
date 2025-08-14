import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Your booking is confirmed! Thank you for choosing our service.
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
