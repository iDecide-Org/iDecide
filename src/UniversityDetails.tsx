import React, { useState } from "react";
import {
  MapPin,
  GraduationCap,
  Share2,
  Heart,
  ChevronRight,
  ChevronLeft,
  Eye,
  Calendar,
  Building,
} from "lucide-react";
import Navbar from "./NavBar";

const UniversityDetails: React.FC = () => {
  // State management

  const [activeTab, setActiveTab] = useState("عن الجامعة");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Images array
  const images = [
    "https://pokonline.com/wp-content/uploads/2023/10/%D8%A7%D9%84%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-%D9%84%D9%84%D8%B9%D9%84%D9%88%D9%85-%D9%88%D8%A7%D9%84%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7-%D9%88%D8%A7%D9%84%D9%86%D9%82%D9%84-%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%89.jpeg",
    "https://lh3.googleusercontent.com/p/AF1QipPhln6TnMPq3R_JbUJCZs-c2A-P7MPOAdZMPnzF=s1360-w1360-h1020",
    "https://lh3.googleusercontent.com/p/AF1QipNtjbr2-XmWZvfaULJI6jJlqsYBdf9EDihGu6JR=s1360-w1360-h1020",
  ];

  const nextImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500); // Match duration with CSS
  };

  const prevImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500); // Match duration with CSS
  };

  // Tabs array
  const tabs = [
    "عن الجامعة",
    "الكليات",
    "شروط القبول",
    "متطلبات التقدم",
    "التواصل",
    "المصروفات",
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100">
          {/* Image Slider */}
          <div className="relative h-[600px] overflow-hidden">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`University ${index + 1}`}
                className={`absolute w-full h-full object-cover transition-all duration-500 ease-in-out
                  ${
                    index === currentImageIndex
                      ? "opacity-100 translate-x-0"
                      : index < currentImageIndex
                      ? "opacity-0 translate-x-full"
                      : "opacity-0 -translate-x-full"
                  }`}
              />
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              disabled={isTransitioning}
              className={`absolute left-6 top-1/2 transform -translate-y-1/2 
                bg-white/20 backdrop-blur-md p-4 rounded-full 
                hover:bg-white/90 transition-all duration-300 group
                ${
                  isTransitioning
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-gray-800" />
            </button>

            <button
              onClick={nextImage}
              disabled={isTransitioning}
              className={`absolute right-6 top-1/2 transform -translate-y-1/2 
                bg-white/20 backdrop-blur-md p-4 rounded-full 
                hover:bg-white/90 transition-all duration-300 group
                ${
                  isTransitioning
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-gray-800" />
            </button>

            {/* Optional: Add slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentImageIndex(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 
                    ${
                      currentImageIndex === index
                        ? "bg-white w-4"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  disabled={isTransitioning}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex space-x-3">
              <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/90 transition-all duration-300 group">
                <Heart className="w-5 h-5 text-white group-hover:text-red-500" />
              </button>
              <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/90 transition-all duration-300 group">
                <Share2 className="w-5 h-5 text-white group-hover:text-blue-500" />
              </button>
            </div>

            {/* University Info Overlay */}
            <div className="absolute bottom-0 right-0 left-0 p-10 text-white backdrop-blur-sm bg-black/20">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري
              </h1>
              <div className="flex items-center space-x-8">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <MapPin className="w-5 h-5 ml-2" />
                  <span>مدينة العلمين، محافظة مطروح</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <Eye className="w-5 h-5 ml-2" />
                  <span>4.8K مشاهدة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 p-8 bg-gray-50/50">
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="bg-blue-50 p-3 rounded-full">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-gray-800 mb-1">
                  25+
                </span>
                <span className="text-sm text-gray-600">برنامج دراسي</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <Building className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-gray-800 mb-1">
                  10+
                </span>
                <span className="text-sm text-gray-600">كلية</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-gray-800 mb-1">
                  2019
                </span>
                <span className="text-sm text-gray-600">سنة التأسيس</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b bg-white sticky top-0 z-10 backdrop-blur-md">
            <div className="flex justify-center space-x-8 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 -mb-px transition-all duration-300 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600 font-semibold scale-105"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-10">
            {activeTab === "عن الجامعة" && (
              <div className="space-y-10">
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    تعتبر الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري
                    مركزاً تعليمياً رائداً في الوطن العربي، حيث تقدم برامج
                    دراسية متميزة متوافقة دولياً. وتجمع بين التعليم النظري
                    والتدريب العملي.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    "الحرم الجامعي يوفر بيئة تعليمية حديثة ومتكاملة",
                    "برامج بكالوريوس مزدوجة مع جامعات عالمية مرموقة",
                    "تخصصات متعددة تشمل طب الأسنان، الصيدلة، الذكاء الاصطناعي",
                    "رؤية متكاملة تدعم التنمية المستدامة وتناسب سوق العمل",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start space-x-4 p-6 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 ml-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="p-16 bg-gradient-to-br from-blue-50 to-blue-100 border-t">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                هل أنت مستعد للانضمام إلينا؟
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                اكتشف المزيد عن برامجنا وابدأ رحلتك الأكاديمية معنا.
              </p>
              <button className="bg-blue-600 text-white py-4 px-10 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                معلومات التقديم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;
