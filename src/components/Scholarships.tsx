import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import ScholarshipCard from "./ScholarshipCard";
import scholarships from "../data/scholarshipsData";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

const Scholarships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter scholarships based on search term and selected filters
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType ? scholarship.type === selectedType : true;
    const matchesLocation = selectedLocation
      ? scholarship.location.includes(selectedLocation)
      : true;

    return matchesSearch && matchesType && matchesLocation;
  });

  // Get unique scholarship types and locations for filters
  const scholarshipTypes = [...new Set(scholarships.map((s) => s.type))];
  const scholarshipLocations = [
    ...new Set(scholarships.map((s) => s.location)),
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      {/* Hero Section - Improved Responsiveness */}
      <section className="bg-white py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
            المنح الدراسية المتاحة
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
            اكتشف المنح الدراسية التي تناسب احتياجاتك وطموحاتك الأكاديمية
          </p>

          {/* Search Bar - Enhanced for Mobile */}
          <div className="max-w-md mx-auto w-full">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن منحة دراسية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-10 pl-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden sticky top-0 z-10 bg-blue-50 p-4 shadow-sm">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white py-2 px-4 rounded-lg border border-gray-200"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}</span>
        </button>
      </div>

      {/* Filters Section - Responsive Design */}
      <section
        className={`py-4 px-4 ${showFilters ? "block" : "hidden"} md:block`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 items-center md:justify-center mb-8">
            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-blue-500 ml-2" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700 w-full"
              >
                <option value="">نوع المنحة</option>
                {scholarshipTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-blue-500 ml-2" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700 w-full"
              >
                <option value="">الموقع</option>
                {scholarshipLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-blue-500 ml-2" />
              <select className="bg-transparent border-none focus:outline-none text-gray-700 w-full">
                <option value="">الموعد النهائي</option>
                <option value="week">خلال أسبوع</option>
                <option value="month">خلال شهر</option>
                <option value="quarter">خلال 3 أشهر</option>
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <DollarSign className="w-5 h-5 text-blue-500 ml-2" />
              <select className="bg-transparent border-none focus:outline-none text-gray-700 w-full">
                <option value="">قيمة المنحة</option>
                <option value="partial">منحة جزئية</option>
                <option value="full">منحة كاملة</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("");
                setSelectedLocation("");
              }}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </section>

      {/* Scholarships List - Improved Grid Layout */}
      <section className="py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8 text-right">
            المنح المتاحة ({filteredScholarships.length})
          </h2>

          {filteredScholarships.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="w-full max-w-[350px] mx-auto"
                >
                  <ScholarshipCard
                    scholarship={scholarship}
                    showSaveButton={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">لا توجد منح مطابقة لبحثك</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("");
                  setSelectedLocation("");
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                عرض جميع المنح
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Scholarship Section - Improved Responsive Design */}
      <section className="py-8 md:py-16 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-12 order-2 md:order-1">
                <div className="text-blue-600 font-semibold mb-4">
                  منحة مميزة
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-right">
                  منحة التميز في علوم الحاسب
                </h3>
                <p className="text-gray-600 mb-6 text-right">
                  منحة تعليمية للطلاب المتميزين في مجالات علوم الحاسب والبرمجة
                  تقدمها شركة مايكروسوفت مصر
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-end text-gray-700">
                    <span>80,000 جنيه سنوياً</span>
                    <DollarSign className="w-5 h-5 ml-2 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end text-gray-700">
                    <span>آخر موعد: 20 يوليو 2024</span>
                    <Calendar className="w-5 h-5 ml-2 text-blue-600" />
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to="/scholarships/6"
                    state={{
                      scholarship: scholarships.find((s) => s.id === 6),
                    }}
                  >
                    <button className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                      عرض التفاصيل
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative h-56 sm:h-64 md:h-auto order-1 md:order-2">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
                  alt="منحة التميز في علوم الحاسب"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                  منحة كاملة
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Scholarships;
