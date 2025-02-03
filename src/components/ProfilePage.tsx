import React, { useState } from "react";
import {
  UserCircle,
  User,
  CheckCircle,
  Heart,
  Bookmark,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "./NavBar";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import StarIcon from "../assets/star.svg";
import UniversityCard from "./UniversityCard";
import universities from "../data/universitiesData";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("البيانات الشخصية");
  const [showEditOptions, setShowEditOptions] = useState(false);
  const { userName, email, handleLogout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [likedUniversities, setLikedUniversities] = useState(universities);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogoutClick = async () => {
    await handleLogout(); // Call the logout function from context
    navigate("/"); // Navigate to the home page after logout
  };

  const handleManualEdit = () => {
    // Handle manual edit logic here
    setShowEditOptions(false);
  };

  const handleAIEdit = () => {
    // Handle AI edit logic here
    setShowEditOptions(false);
  };

  const handleRemoveFromFavorites = (id: number) => {
    setLikedUniversities((prev) => prev.filter((uni) => uni.id !== id));
    console.log(`Removing university with id: ${id}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen">
      <Navbar />

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
            onClick={handleLogoutClick} // Use the new logout handler
            className="flex items-center mt-4 space-x-2 p-2 rounded-md w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200 focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </aside>

        <main className="flex-1 p-8">
          <div className="container mx-auto">
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
                  <div className="relative">
                    <button
                      onClick={() => setShowEditOptions(!showEditOptions)}
                      className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                    >
                      تعديل البيانات
                    </button>

                    {showEditOptions && (
                      <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-81 p-2 space-y-2">
                        <button
                          onClick={handleManualEdit}
                          className="w-full text-right px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md transition duration-200 flex items-center gap-3"
                        >
                          <User className="w-5 h-5 flex-shrink-0" />
                          <span className="flex-grow text-right">
                            تعديل البيانات يدويا
                          </span>
                        </button>
                        <button
                          onClick={handleAIEdit}
                          className="w-full text-right px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md transition duration-200 flex items-center gap-3"
                        >
                          <span className="text-xl flex-shrink-0">
                            <img src={StarIcon} alt="Star Icon" />
                          </span>
                          <span className="flex-grow text-right">
                            تعديل البيانات بواسطة الذكاء العربي
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "استشارتي" && (
                <p className="text-gray-600 p-4">
                  This is the استشارتي content.
                </p>
              )}
              {activeTab === "المفضلة" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                      <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>تصفية حسب النوع</option>
                        <option>الجامعات الخاصة</option>
                        <option>الجامعات الأهلية</option>
                        <option>الجامعات الحكومية</option>
                      </select>
                      <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>ترتيب حسب</option>
                        <option>الأحدث</option>
                        <option>الأقدم</option>
                        <option>المشاهدات</option>
                      </select>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">12</span> جامعة في المفضلة
                    </div>
                  </div>

                  {/* Empty State */}
                  {likedUniversities.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        لا توجد جامعات في المفضلة
                      </h3>
                      <p className="text-gray-500 mb-6">
                        ابدأ في استكشاف الجامعات وأضف ما يعجبك إلى المفضلة
                      </p>
                      <Link
                        to="/universities"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                      >
                        استكشف الجامعات
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedUniversities.map((university) => (
                        <div key={university.id} className="relative group">
                          <UniversityCard
                            university={university}
                            showFavoriteButton={true}
                            onFavoriteClick={() =>
                              handleRemoveFromFavorites(university.id)
                            }
                            isFavorite={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {likedUniversities.length > 0 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        السابق
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        1
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        3
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        التالي
                      </button>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "طلباتي" && (
                <p className="text-gray-600 p-4">This is the طلباتي content.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
