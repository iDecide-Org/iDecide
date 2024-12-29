import React from "react";
import { Link } from "react-router-dom";
import { User, Menu, X, LogOut, Settings } from "lucide-react";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  userName: string;
  handleLogin: () => void;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  isProfileOpen,
  setIsProfileOpen,
  isLoggedIn,
  userName,
  handleLogin,
  handleLogout,
}) => {
  return (
    <nav className="bg-white p-4 border-b border-gray-200 flex justify-between items-center w-full">
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold text-blue-600"
        >
          <span className="mr-2">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-book w-9 h-9 text-blue"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
          </span>
          iDecide
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex space-x-6">
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
          >
            من نحن
          </Link>
          <Link
            to="/universities"
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
          >
            استكشف الجامعات
          </Link>
          <Link
            to="/universities"
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
          >
            استكشف التخصصات
          </Link>
          <Link
            to="/universities"
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
          >
            استكشف المسارات الوظيفية
          </Link>
          <Link
            to="/chatbot"
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
          >
            اعرف نفسك
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="w-6 h-6" />
              <span>{userName}</span>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  الملف الشخصي
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="inline-block w-4 h-4 mr-2" />
                  الإعدادات
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="inline-block w-4 h-4 mr-2" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
            onClick={handleLogin}
          >
            تسجيل الدخول
          </Link>
        )}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
