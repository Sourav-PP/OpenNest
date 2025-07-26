import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { authApi } from "../../server/api/auth";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authApi.logout()
      dispatch(logout());
      localStorage.removeItem("persist:root");
      toast.success("Logout successfully");
      navigate('/login?role=psychologist');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log('error is admin: ', error);
      toast.error(
        "Logout failed: " + error?.response?.data?.message || "Unknown error"
      );
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="text-xl font-semibold text-gray-800"></div>
      <div className="flex items-center gap-4">
        <p className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">{email}</p>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {email?.slice(0,2).toUpperCase()}
        </div>
        <div className="group text-center">
        <button
          onClick={handleLogout}
          className="btn-logout flex rounded-full group-hover:animate-glow-ring"
        >
          Logout
        </button>
        </div>
      </div>
    </div>
  );
};

export default Header;