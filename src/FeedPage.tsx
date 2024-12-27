// Simulated Universities data
const universities = [
  {
    id: 1,
    name: "جامعة المدينة بالقاهرة CUC",
    location: "مدينة هليوبوليس الجديدة، طري....",
    type: "الجامعات الخاصة",
    image:
      "https://www.propertyfinder.eg/blog/wp-content/uploads/2020/03/nile.jpg",
    views: "4.8K",
    date: "2024-09-17",
    colleges: "0+",
    majors: "0",
    establishment: "2019",
  },
  {
    id: 2,
    name: "الأكاديمية العربية للعلوم.....",
    location: "مدينة العلمين العلمين، محاف...",
    type: "الجامعات ذات الطبيعة الخاصة",
    image:
      "https://studyinegy.com/wp-content/uploads/2023/06/5AB2E0FB-B130-41D1-8F5B-7D754A3E3521.webp",
    views: "7.5K",
    date: "2024-09-24",
    colleges: "4+",
    majors: "14",
    establishment: "2023",
  },
  {
    id: 3,
    name: "الجامعة الفرنسية في مصر UFE",
    location: "37 طريق القاهرة الإسماعيلية.....",
    type: "الجامعات الأهلية",
    image:
      "https://almasaraleqtsady.com/wp-content/uploads/2022/08/IMG-20220816-WA0036.jpg",
    views: "10.3K",
    date: "2024-08-13",
    colleges: "3+",
    majors: "8",
    establishment: "2002",
  },
  {
    id: 4,
    name: "جامعة المدينة بالقاهرة CUC",
    location: "مدينة هليوبوليس الجديدة، طري....",
    type: "الجامعات الخاصة",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6KMlIVDSaa4JsLeDHDwUF7jpiRQvha6U_3A&s",
    views: "4.8K",
    date: "2024-09-17",
    colleges: "0+",
    majors: "0",
    establishment: "2019",
  },
  {
    id: 5,
    name: "الجامعة المصرية للتعلم الالكتروني",
    location: "مدينة العلمين العلمين، محاف...",
    type: "الجامعات ذات الطبيعة الخاصة",
    image:
      "https://img.youm7.com/ArticleImgs/2020/8/5/359465-%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9.jpeg",
    views: "7.5K",
    date: "2024-09-24",
    colleges: "4+",
    majors: "14",
    establishment: "2023",
  },
  {
    id: 6,
    name: "جامعة الملك سلمان الدولية",
    location: "37 طريق القاهرة الإسماعيلية.....",
    type: "الجامعات الأهلية",
    image: "https://cdn.elwatannews.com/watan/840x473/10812096271660043610.jpg",
    views: "10.3K",
    date: "2024-08-13",
    colleges: "3+",
    majors: "8",
    establishment: "2002",
  },

  {
    id: 7,
    name: "جامعة المدينة بالقاهرة CUC",
    location: "مدينة هليوبوليس الجديدة، طري....",
    type: "الجامعات الخاصة",
    image:
      "https://www.propertyfinder.eg/blog/wp-content/uploads/2020/03/nile.jpg",
    views: "4.8K",
    date: "2024-09-17",
    colleges: "0+",
    majors: "0",
    establishment: "2019",
  },
  {
    id: 8,
    name: "الأكاديمية العربية للعلوم.....",
    location: "مدينة العلمين العلمين، محاف...",
    type: "الجامعات ذات الطبيعة الخاصة",
    image:
      "https://studyinegy.com/wp-content/uploads/2023/06/5AB2E0FB-B130-41D1-8F5B-7D754A3E3521.webp",
    views: "7.5K",
    date: "2024-09-24",
    colleges: "4+",
    majors: "14",
    establishment: "2023",
  },
];

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  Eye,
  Calendar,
  GraduationCap,
  Building,
  Clock,
} from "lucide-react";
import Navbar from "./NavBar";

const FeedPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    establishment: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName] = useState("محمد علي");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
  };

  const filteredUniversities = universities.filter((university) => {
    const matchesSearch = university.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation = university.location.includes(filters.location);
    const matchesType = university.type.includes(filters.type);
    const matchesEstablishment = university.establishment.includes(
      filters.establishment
    );
    return (
      matchesSearch && matchesLocation && matchesType && matchesEstablishment
    );
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Navigation Bar */}
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isLoggedIn={isLoggedIn}
        userName={userName}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />

      {/* Mobile Menu */}
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

      {/* Search and Filters Section */}
      <section className="bg-white p-6 border-b border-gray-200 w-full">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن جامعة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-right px-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 pl-10"
            />
          </div>
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          >
            <option value="">المكان (الأقاليم، محافظة)</option>
            <option>القاهرة</option>
            <option>الجيزة</option>
            <option>الأسكندرية</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          >
            <option value="">نوع الجامعة</option>
            <option>الجامعات الخاصة</option>
            <option>الجامعات الأهلية</option>
            <option>الجامعات الحكومية</option>
          </select>
          <select
            value={filters.establishment}
            onChange={(e) =>
              setFilters({ ...filters, establishment: e.target.value })
            }
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          >
            <option value="">سنة التأسيس</option>
            <option>2019</option>
            <option>2023</option>
            <option>2002</option>
          </select>
        </div>
      </section>

      {/* University Cards Section */}
      <section className="w-full flex-grow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
          الجامعات المقترحة لك : ({filteredUniversities.length})
        </h2>
        {filteredUniversities.length === 0 ? (
          <div className="text-center text-gray-600">
            لا توجد جامعات تطابق تفضيلاتك.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUniversities.map((university) => (
              <div
                key={university.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col items-center">
                    <button className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300 mt-1">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-md px-2 py-1">
                    <span className="flex items-center text-xs text-gray-700">
                      <Eye className="w-4 h-4 ml-1" />
                      {university.views} مشاهدة
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-md px-2 py-1">
                    <span className="flex items-center text-xs">رائج الان</span>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-right">
                    {university.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2 mr-0">
                    <MapPin className="w-4 h-4 ml-1" />
                    <span className="text-right">{university.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 text-right mr-0">
                    {university.type}
                  </p>
                  <div className="flex items-center justify-between mt-2 mb-4 mr-0">
                    <div className="text-gray-600 text-sm flex items-center">
                      <Clock className="w-4 h-4 ml-1" />
                      <span className="text-right">{university.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center text-xs text-gray-600 mr-0">
                        <Building className="w-4 h-4 ml-1" />
                        <span>{university.colleges}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mr-0">
                        <GraduationCap className="w-4 h-4 ml-1" />
                        <span>{university.majors}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mr-0">
                        <Calendar className="w-4 h-4 ml-1" />
                        <span>{university.establishment}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition duration-300">
                      عرض تفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Note */}
      <footer className="text-center text-xs text-gray-500 py-4 w-full">
        © {new Date().getFullYear()} iDecide. All rights reserved.
      </footer>
    </div>
  );
};

export default FeedPage;
