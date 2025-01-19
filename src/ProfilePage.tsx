import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  User,
  CheckCircle,
  Heart,
  Bookmark,
  LogOut,
} from "lucide-react";
import Navbar from "./NavBar";
import { useAuth } from "./AuthContext";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("البيانات الشخصية");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { userName, email, handleLogout } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen">
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 w-full">
          <div className="flex flex-col space-y-4 p-4">
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
              to="/majors"
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              استكشف التخصصات
            </Link>
            <Link
              to="/careers"
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              استكشف المسارات الوظيفية
            </Link>
            <Link
              to="/self"
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              اعرف نفسك
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <aside className="bg-white p-6 w-64 border-r border-gray-200 shadow-lg">
          <div className="mb-6 text-center">
            <div className="relative">
              <div className="flex flex-col items-center space-y-2 text-gray-700 focus:outline-none">
                <UserCircle className="w-16 h-16 text-blue-600" />
                <div className="font-bold text-lg">{userName}</div>
                <div className="text-sm text-gray-500">{email}</div>
              </div>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              { tab: "البيانات الشخصية", icon: <User className="w-4 h-4" /> },
              { tab: "استشارتي", icon: <CheckCircle className="w-4 h-4" /> },
              { tab: "المفضلة", icon: <Heart className="w-4 h-4" /> },
              { tab: "طلباتي", icon: <Bookmark className="w-4 h-4" /> },
            ].map((item) => (
              <li
                key={item.tab}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition duration-200 ${
                  activeTab === item.tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => handleTabClick(item.tab)}
              >
                {item.icon}
                <span>{item.tab}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center mt-4 space-x-2 p-2 rounded-md w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200 focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </aside>

        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              حسابي الشخصي
            </h2>
            {activeTab === "البيانات الشخصية" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الاسم الاول
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={userName}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الاسم الاخير
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={userName}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      البريد الالكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الباسورد
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="الباسورد"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      رقم الهاتف
                    </label>
                    <div className="flex items-center">
                      <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700">
                        <option>مصر</option>
                      </select>
                      <input
                        type="tel"
                        id="phoneNumber"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      النوع
                    </label>
                    <select
                      id="gender"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    >
                      <option>اختار</option>
                      <option>ذكر</option>
                      <option>انثي</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="gradeType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      نوع الشهاده
                    </label>
                    <select
                      id="gradeType"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    >
                      <option>شهاده الثانويه المصريه</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="gradePercentage"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      النسبه الحاصله عليها
                    </label>
                    <input
                      type="number"
                      id="gradePercentage"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الجنسيه
                    </label>
                    <select
                      id="nationality"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    >
                      <option>مصري</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الدوله
                    </label>
                    <select
                      id="country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      dir="rtl"
                    >
                      <option>اختار</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    أفضل طريقة للتواصل ؟
                  </p>
                  <div className="flex space-x-2">
                    {["هاتف", "بريد الإلكتروني", "واتساب"].map((method) => (
                      <button
                        key={method}
                        className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
                  تعديل البيانات
                </button>
              </div>
            )}
            {activeTab === "استشارتي" && (
              <p className="text-gray-600 p-4">This is the استشارتي content.</p>
            )}
            {activeTab === "المفضلة" && (
              <p className="text-gray-600 p-4">This is the المفضلة content.</p>
            )}
            {activeTab === "طلباتي" && (
              <p className="text-gray-600 p-4">This is the طلباتي content.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
