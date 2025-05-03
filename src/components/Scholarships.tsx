import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import ScholarshipCard from "./ScholarshipCard";
import {
  getAllScholarships,
  Scholarship,
} from "../services/scholarshipService";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Scholarships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const data = await getAllScholarships();
        setScholarships(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch scholarships:", err);
        setError("فشل في تحميل المنح الدراسية. يرجى المحاولة مرة أخرى.");
        setScholarships([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      (scholarship.name &&
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (scholarship.description &&
        scholarship.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (scholarship.provider &&
        scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType ? scholarship.type === selectedType : true;
    const matchesLocation = selectedLocation
      ? scholarship.country?.includes(selectedLocation)
      : true;

    return matchesSearch && matchesType && matchesLocation;
  });

  const scholarshipTypes = [
    ...new Set(scholarships.map((s) => s.type).filter(Boolean)),
  ];
  const scholarshipCountries = [
    ...new Set(scholarships.map((s) => s.country).filter(Boolean)),
  ];

  const featuredScholarship = scholarships.find(
    (s) => s.id === "17ae0bfc-cd66-4021-a7cb-7d15d2cbe2a4"
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <section className="bg-white py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
            المنح الدراسية المتاحة
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
            اكتشف المنح الدراسية التي تناسب احتياجاتك وطموحاتك الأكاديمية
          </p>

          <div className="max-w-md mx-auto w-full">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم، الجهة المانحة، الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-10 pl-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden sticky top-0 z-10 bg-blue-50 p-4 shadow-sm">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white py-2 px-4 rounded-lg border border-gray-200"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}</span>
        </button>
      </div>

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
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <option value="">الدولة</option>
                {scholarshipCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-blue-500 ml-2" />
              <select
                className="bg-transparent border-none focus:outline-none text-gray-700 w-full"
                disabled={isLoading}
              >
                <option value="">الموعد النهائي</option>
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <DollarSign className="w-5 h-5 text-blue-500 ml-2" />
              <select
                className="bg-transparent border-none focus:outline-none text-gray-700 w-full"
                disabled={isLoading}
              >
                <option value="">قيمة المنحة</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("");
                setSelectedLocation("");
              }}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={isLoading}
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8 text-right">
            المنح المتاحة ({isLoading ? "..." : filteredScholarships.length})
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="ml-4 text-gray-600">جاري تحميل المنح...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-12 md:py-16 bg-red-50 text-red-700 rounded-lg shadow">
              <p className="text-lg">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredScholarships.length === 0 && (
            <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">
                {scholarships.length > 0
                  ? "لا توجد منح مطابقة لبحثك"
                  : "لا توجد منح متاحة حالياً"}
              </p>
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

          {!isLoading && !error && filteredScholarships.length > 0 && (
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
          )}
        </div>
      </section>

      <section className="py-8 md:py-16 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto">
          {featuredScholarship ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 md:p-12 order-2 md:order-1">
                  <div className="text-blue-600 font-semibold mb-4">
                    منحة مميزة
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-right">
                    {featuredScholarship.name}
                  </h3>
                  <p className="text-gray-600 mb-6 text-right">
                    {featuredScholarship.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-end text-gray-700">
                      <span>{featuredScholarship.amount || "N/A"}</span>
                      <DollarSign className="w-5 h-5 ml-2 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-end text-gray-700">
                      <span>
                        آخر موعد:{" "}
                        {new Date(
                          featuredScholarship.deadline
                        ).toLocaleDateString("ar-EG")}
                      </span>
                      <Calendar className="w-5 h-5 ml-2 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Link
                      to={`/scholarships/${featuredScholarship.id}`}
                      state={{ scholarship: featuredScholarship }}
                    >
                      <button className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        عرض التفاصيل
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="relative h-56 sm:h-64 md:h-auto order-1 md:order-2">
                  <img
                    src={
                      featuredScholarship.image ||
                      "https://media.elwatannews.com/media/img/mediaarc/large/4718372191689360201.jpg"
                    }
                    alt={featuredScholarship.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                    {featuredScholarship.type}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="text-center text-gray-600">
                لم يتم العثور على المنحة المميزة.
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Scholarships;
