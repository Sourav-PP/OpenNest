import LoginForm from '../../components/user/LoginForm';
import { assets } from '../../assets/assets';


const LoginPage = () => {
  return (
    <div className="relative min-h-screen bg-auth flex justify-center items-center bg-cover bg-center bg-no-repeat px-3 sm:px-0 py-8 sm:py-12 h-full">
      {/* Overlay over background */}
      <div className="absolute inset-0 bg-[#B0C9D5] opacity-35 z-0"></div>

      {/* Foreground Content (Form + Image side-by-side) */}
      <div className="relative z-10 flex items-center flex-col md:flex-row w-full h-full max-w-6xl mx-auto">
    
        {/* Left: Form Side */}
        <div className="md:w-1/2 w-full items-center flex justify-start px-6">
          <div className="bg-white p-10 w-full max-w-sm rounded-[10%10%10%10%/8%8%8%8%] overflow-hidden text-gray-500 text-sm shadow-[0_15px_30px_rgba(0,0,0,0.05)]">
            <div className="w-full flex justify-center mb-2">
              <img className="w-32" src={assets.logo} alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A4384] text-center mb-5">
          Sign In
            </h2>
            <LoginForm />
          </div>
        </div>

    
      </div>
      {/* Right: Full Image Side */}
      <div className="hidden border border-none rounded-3xl md:w-[850px] w-full h-full md:block absolute top-0 right-0 bg-login bg-cover bg-center">
      </div>
    </div>



  );
};

export default LoginPage;
