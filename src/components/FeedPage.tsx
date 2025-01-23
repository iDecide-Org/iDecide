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
import { BookOpen, Target, Brain, Trophy } from "lucide-react";
import Navbar from "./NavBar";
import UniversityCard from "./UniversityCard";
import Footer from "./Footer";
import { useAuth } from "../contexts/useAuth";

const FeedPage: React.FC = () => {
  const { userName } = useAuth();
  const [activeSection, setActiveSection] = useState("recommended");

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen">
      <Navbar />

      {/* Welcome Section */}
      <section className="bg-white p-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-right mb-2">
            مرحباً {userName}! 👋
          </h1>
          <p className="text-gray-600 text-right">
            تابع تقدمك واكتشف التوصيات المخصصة لك
          </p>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">التقييم الشخصي</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">85%</h3>
              <p className="text-sm text-gray-600">اكتمال التقييم</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">الجامعات المحفوظة</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
              <p className="text-sm text-gray-600">جامعة في القائمة</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">التخصصات المقترحة</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">5</h3>
              <p className="text-sm text-gray-600">تخصصات تناسب اهتماماتك</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">نسبة التوافق</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">92%</h3>
              <p className="text-sm text-gray-600">مع اختياراتك الحالية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {["recommended", "saved", "recent"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {section === "recommended" && "موصى به"}
                {section === "saved" && "محفوظ"}
                {section === "recent" && "مؤخراً"}
              </button>
            ))}
          </div>

          {/* Personalized Recommendations */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-right">
              توصيات مخصصة لك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Map through filtered universities based on activeSection */}
              {universities.slice(0, 3).map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-right">
              خطواتك القادمة
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <button className="text-blue-600 hover:underline">
                  اكمل الآن
                </button>
                <span className="text-gray-700">اكمل تقييمك الشخصي</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <button className="text-blue-600 hover:underline">
                  استكشف
                </button>
                <span className="text-gray-700">
                  اكتشف المزيد عن التخصصات الموصى بها
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer className="mt-auto" />
    </div>
  );
};

export default FeedPage;
