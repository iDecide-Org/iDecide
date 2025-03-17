import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, userName, handleLogout, isAdvisor } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white p-4 border-b border-gray-200 flex justify-between items-center w-full">
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold text-blue-600"
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-book w-9 h-9 text-blue"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
          </span>
          iDecide
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn && isAdvisor ? (
            // Advisor-specific navigation links
            <>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                لوحة التحكم
              </Link>
              <Link
                to="/universities/add"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                إضافة جامعة
              </Link>
              <Link
                to="/universities/manage"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                إدارة الجامعات
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                من نحن
              </Link>
            </>
          ) : (
            // Student or non-logged in navigation links
            <>
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
                to="/scholarships"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                المنح الدراسية
              </Link>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              >
                استكشف المسارات الوظيفية
              </Link>
              {isLoggedIn ? (
                <Link
                  to="/feed"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                >
                  الصفحة الرئيسية
                </Link>
              ) : (
                <Link
                  to="/chatbot"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                >
                  اعرف نفسك
                </Link>
              )}
            </>
          )}
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
                {!isAdvisor && (
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    الإعدادات
                  </Link>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="inline-block w-4 h-4 mr-2" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 w-full absolute top-16 left-0">
          <div className="flex flex-col space-y-4 p-4">
            {isLoggedIn && isAdvisor ? (
              // Advisor mobile menu
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
                <Link
                  to="/universities/add"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إضافة جامعة
                </Link>
                <Link
                  to="/universities/manage"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إدارة الجامعات
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  من نحن
                </Link>
              </>
            ) : (
              // Student or non-logged in mobile menu
              <>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  من نحن
                </Link>
                <Link
                  to="/universities"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  استكشف الجامعات
                </Link>
                <Link
                  to="/scholarships"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  المنح الدراسية
                </Link>
                <Link
                  to="/jobs"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  استكشف المسارات الوظيفية
                </Link>
                {isLoggedIn ? (
                  <Link
                    to="/feed"
                    className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الصفحة الرئيسية
                  </Link>
                ) : (
                  <Link
                    to="/chatbot"
                    className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    اعرف نفسك
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
