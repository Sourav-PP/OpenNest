import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Your payment was cancelled. If this was a mistake, please try again.
      </p>
      <Link
        to="/user/therapist"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
      >
        Try Again
      </Link>
    </div>
  );
}
