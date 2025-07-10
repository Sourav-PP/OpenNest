import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-12 px-6    sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left section - Logo and Copyright */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={assets.logo} alt="Logo" className="w-28 sm:w-36" />
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 OpenNest . All rights reserved.
            </p>
          </div>
          
          {/* Middle section - Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Services
              </a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Therapists
              </a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Contact Us
              </a>
            </div>
            
            <div className="space-y-3">
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Terms and conditions
              </a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
          
          {/* Right section - Social Media Icons */}
          <div className="flex justify-end space-x-4">
            <a 
              href="#" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <img src={assets.youtube} alt="Youtube icon" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
                <img src={assets.instagram} alt="Instagram icon" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <img src={assets.facebook} alt="Facebook icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;