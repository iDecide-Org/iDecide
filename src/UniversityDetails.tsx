import React, { useState, useEffect } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("عن الجامعة");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images array
  const images = [
    "https://pokonline.com/wp-content/uploads/2023/10/%D8%A7%D9%84%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-%D9%84%D9%84%D8%B9%D9%84%D9%88%D9%85-%D9%88%D8%A7%D9%84%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7-%D9%88%D8%A7%D9%84%D9%86%D9%82%D9%84-%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%89.jpeg",
    "https://lh3.googleusercontent.com/p/AF1QipPhln6TnMPq3R_JbUJCZs-c2A-P7MPOAdZMPnzF=s1360-w1360-h1020",
    "https://lh3.googleusercontent.com/p/AF1QipNtjbr2-XmWZvfaULJI6jJlqsYBdf9EDihGu6JR=s1360-w1360-h1020",
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/user", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          setIsLoggedIn(true);
          setUserName(user.name);
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  // Handle login/logout
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setIsProfileOpen(false);
      setUserName("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Slider */}
          <div className="relative h-[500px]">
            <img
              src={images[currentImageIndex]}
              alt="University"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white/90 p-3 rounded-full hover:bg-white transition duration-300">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button className="bg-white/90 p-3 rounded-full hover:bg-white transition duration-300">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* University Info Overlay */}
            <div className="absolute bottom-0 right-0 left-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">
                الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري
              </h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 ml-2" />
                  <span>مدينة العلمين، محافظة مطروح</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 ml-2" />
                  <span>4.8K مشاهدة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50">
            <div className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  25+
                </span>
                <span className="text-sm text-gray-600">برنامج دراسي</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <Building className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  10+
                </span>
                <span className="text-sm text-gray-600">كلية</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  2019
                </span>
                <span className="text-sm text-gray-600">سنة التأسيس</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b">
            <div className="flex justify-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 -mb-px ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "عن الجامعة" && (
              <div className="space-y-8">
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
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
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="p-8 bg-gray-50 border-t">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                هل أنت مستعد للانضمام إلينا؟
              </h3>
              <p className="text-gray-600 mb-6">
                اكتشف المزيد عن برامجنا وابدأ رحلتك الأكاديمية معنا.
              </p>
              <button className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
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
