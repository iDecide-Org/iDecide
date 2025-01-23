// UniversitiesPage.js
import React, { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "./NavBar";
import UniversityCard from "./UniversityCard"; // Import the UniversityCard component
import Footer from "./Footer";
import universities from "../universitiesData";

const UniversitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("الجامعات");
  const [isCumulativeFilter, setIsCumulativeFilter] = useState(false);
  const [universityName, setUniversityName] = useState("");

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* Search and Filter Section */}
      <section className="bg-white p-6 border-b border-gray-200 w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          اكتشف أفضل الجامعات والكليات والتخصصات المتاحة.
        </h2>
        <p className="text-center text-gray-700 mb-6">
          ابحث عن الجامعات والكليات والتخصصات التي تلبي طموحاتك الأكاديمية.
        </p>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "الجامعات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("الجامعات")}
          >
            الجامعات
          </button>
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "كليات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("كليات")}
          >
            كليات
          </button>
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "تخصصات الكليات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("تخصصات الكليات")}
          >
            تخصصات الكليات
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن جامعة"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="w-full text-right px-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 pl-10"
            />
          </div>
          <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300">
            <option>نوع الجامعة</option>
            <option>الجامعات الخاصة</option>
            <option>الجامعات الأهلية</option>
            <option>الجامعات الحكومية</option>
          </select>
          <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300">
            <option>المكان (الأقاليم، محافظة)</option>
            <option>القاهرة</option>
            <option>الجيزة</option>
            <option>الأسكندرية</option>
          </select>
          <button className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300">
            فلترة
          </button>
        </div>
        <div className="flex items-center justify-end">
          <label
            htmlFor="cumulativeFilter"
            className="flex items-center cursor-pointer"
          >
            <span className="text-gray-700 mr-2">الفلترة التراكمية</span>
            <div className="relative">
              <input
                type="checkbox"
                id="cumulativeFilter"
                className="sr-only"
                checked={isCumulativeFilter}
                onChange={() => setIsCumulativeFilter(!isCumulativeFilter)}
              />
              <div
                className={`w-10 h-5 bg-gray-400 rounded-full shadow-inner transition duration-300 ease-in-out transform ${
                  isCumulativeFilter ? "bg-blue-600" : ""
                }`}
              >
                <span
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ease-in-out ${
                    isCumulativeFilter ? "translate-x-5" : "translate-x-0.5"
                  }`}
                ></span>
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* University Cards Section */}
      <section className="w-full flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
            نتائج البحث : ({universities.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-6 justify-items-center">
            {universities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                showFavoriteButton={true}
                isFavorite={false}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer className="mt-10" />
    </div>
  );
};

export default UniversitiesPage;
