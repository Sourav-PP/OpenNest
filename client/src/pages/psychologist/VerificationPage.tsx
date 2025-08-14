import VerificationForm from '../../components/psychologist/VerificationForm';

export default function VerificationPage() {
  console.log('📍 Loaded: VerificationPage');
  return (
    <div className="relative flex items-center justify-center min-h-screen px-5 sm:px-6 bg-auth bg-cover bg-center py-8 sm:py-12 overflow-auto">
      <div className="absolute inset-0 bg-white opacity-10 z-0"></div>
      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-full mx-auto sm:w-[500px] text-gray-500 text-sm">
        <h2 className="text-3xl font-bold text-[#3EB1EB] text-center">
                    Verification
        </h2>
        <p className="text-center  mb-8">Submit the Details to get Verified and Listed </p>
        <VerificationForm />
      </div>
    </div>
  );
}