import { useState } from "react";
import { assets } from "../../assets/assets";
import { FiMenu, FiX } from "react-icons/fi";
import BellButton from "./BellButton";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login?role=user')
  }

  return (
    <div className="px-7 py-4 w-full sm:px-24 sm:py-6 fixed z-50">
      <nav className="relative flex justify-between items-center px-3 py-2 sm:px-2 sm:py-2 bg-white shadow-md border-[3px] border-[#3EB1EB] rounded-full">
        {/* Logo */}
        <img src={assets.logo} alt="Logo" className="w-20 sm:w-28 ms-2" />

        {/* Desktop Menu */}
        <ul className="sm:ms-14 hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="cursor-pointer font-semibold transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            Home
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            Services
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            Therapists
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            About
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            Contact
          </li>
        </ul>

        {/* Right Section (Bell + Login + Menu) */}
        <div className="flex items-center gap-3">
          {/* Bell always visible */}
          <BellButton />

          {/* Login/Register for md+ */}
          <div className="hidden md:block group text-center">
            <button onClick={handleLogin} className="btn-login sm:px-5 group-hover:animate-glow-ring">
              Login/Register
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden text-2xl text-[#3EB1EB]">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`absolute top-full right-0 bg-white shadow-lg rounded-lg mt-2 p-6 flex flex-col gap-6 md:hidden transition-all duration-300 ease-in-out transform origin-top ${
            menuOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          <button className="cursor-pointer font-semibold text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Home
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Services
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Therapists
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Blog
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Contact
          </button>
          <button
            onClick={handleLogin}
            type="submit"
            className="btn-login w-[10rem] px-6 py-2 rounded-md text-white bg-[#3EB1EB] hover:bg-[#2A9CDB] transition-colors duration-200"
          >
            Login/Register
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
