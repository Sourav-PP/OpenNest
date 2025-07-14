import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import instance from "../../lib/axios";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async() => {
    try {
      await instance.post('/admin/logout')

      dispatch(logout())
      toast.success("Logout successfully")

      navigate('/admin/login')
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log('error is admin: ', error)
      toast.error(
      "Admin Logout failed: " + error?.response?.data?.message || "Unknown error"
      );
    }
  }

  return (
    <div className="flex justify-between items-center px-6 py-4 text-white">
    <div></div>
      <button
      onClick={handleLogout}
      className="btn-logout flex rounded-full">
            Logout
      </button>
    </div>
  );
};

export default Header;