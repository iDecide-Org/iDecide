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

// FeedPage.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "./NavBar";
import UniversityCard from "./UniversityCard"; // Import the new component

const FeedPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    establishment: "",
  });

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
      <Navbar />

      {/* Search and Filter Section */}
      <section className="bg-white p-6 border-b border-gray-200 w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          اكتشف أفضل الجامعات والكليات والتخصصات المتاحة.
        </h2>
        <p className="text-center text-gray-700 mb-6">
          ابحث عن الجامعات والكليات والتخصصات التي تلبي طموحاتك الأكاديمية.
        </p>

        {/* Search and Filters */}
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
      <section className="w-full flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
            الجامعات المقترحة لك : ({filteredUniversities.length})
          </h2>
          {filteredUniversities.length === 0 ? (
            <div className="text-center text-gray-600">
              لا توجد جامعات تطابق تفضيلاتك.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-6 justify-items-center">
              {filteredUniversities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Note */}
      <footer className="text-center text-xs text-gray-500 py-4 w-full">
        © {new Date().getFullYear()} iDecide. All rights reserved.
      </footer>
    </div>
  );
};

export default FeedPage;
