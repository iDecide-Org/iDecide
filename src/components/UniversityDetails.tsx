import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Share,
  MessageSquare,
  Heart,
  AlertTriangle,
  Check,
} from "lucide-react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { getUniversityById, getImageUrl } from "../services/universityService";
import { addFavoriteUniversity, removeFavoriteUniversity, isUniversityInFavorites } from "../services/favoriteService";
import { useAuth } from "../contexts/useAuth";

const UniversityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isLoggedIn, isAdvisor } = useAuth(); // Get isAdvisor from useAuth

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getUniversityById(id);
        setUniversity(data);

        // Check if the university is in favorites
        if (isLoggedIn) {
          const favorite = await isUniversityInFavorites(id);
          setIsFavorite(favorite);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching university:", err);
        setError("فشل في تحميل بيانات الجامعة");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id, isLoggedIn]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn || !id) return;

    try {
      if (isFavorite) {
        await removeFavoriteUniversity(id);
        setIsFavorite(false);
        setSuccessMessage("تمت إزالة الجامعة من المفضلة");
      } else {
        await addFavoriteUniversity(id);
        setIsFavorite(true);
        setSuccessMessage("تمت إضافة الجامعة إلى المفضلة");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      setError("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  // Function to handle starting a chat
  const handleStartChat = () => {
    if (!isLoggedIn || isAdvisor || !university?.advisor?.id) return;
    // Navigate to the chat page with the advisor's ID
    navigate(`/chat/${university.advisor.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <p>{error || "لم يتم العثور على الجامعة المطلوبة"}</p>
            </div>
            <div className="mt-4">
              <Link to="/universities" className="text-blue-600 hover:underline">
                العودة إلى صفحة الجامعات
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* University Hero Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            <img
              src={getImageUrl(university.image)}
              alt={university.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 w-full p-6 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{university.name}</h1>
                  <div className="flex items-center mt-2">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{university.location}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isLoggedIn && (
                    <button
                      onClick={handleToggleFavorite}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full backdrop-blur-sm transition duration-300"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite ? "fill-current text-red-500" : "text-white"
                        }`}
                      />
                    </button>
                  )}
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full backdrop-blur-sm transition duration-300">
                    <Share className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-blue-600 text-white p-4">
            <div className="container mx-auto">
              <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-0">
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  <span>{university.type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>تأسست عام {university.establishment}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  <span>{university.collegesCount} كلية</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>{university.majorsCount} تخصص</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                عن الجامعة
              </h2>
              <div className="prose max-w-none text-right">
                <p className="text-gray-700">{university.description || 'لا يوجد وصف متاح حالياً.'}</p>
              </div>
            </div>

            {/* Colleges Section - Placeholder for now */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                الكليات والتخصصات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-right">كلية الهندسة</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-right">
                    <li>هندسة البرمجيات</li>
                    <li>هندسة الاتصالات</li>
                    <li>هندسة مدنية</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-right">كلية الطب</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-right">
                    <li>طب بشري</li>
                    <li>طب أسنان</li>
                    <li>صيدلة</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300">
                  عرض كل الكليات والتخصصات
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact and Request Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                تواصل مع الجامعة
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
                  <p className="mb-2">هل تريد معلومات إضافية عن الجامعة؟</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full">
                    طلب معلومات
                  </button>
                </div>

                {/* Show chat button only for logged-in students and if advisor exists */}
                {isLoggedIn && !isAdvisor && university?.advisor && (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center mt-4">
                    <p className="mb-2">هل لديك أسئلة محددة؟</p>
                    <button 
                      onClick={handleStartChat} // Use the new handler
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>دردشة مع المرشد الأكاديمي</span>
                    </button>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2 text-right">معلومات الاتصال</h4>
                  <ul className="space-y-2 text-gray-700 text-right">
                    <li>الموقع الإلكتروني: www.university-website.edu</li>
                    <li>البريد الإلكتروني: admissions@university-website.edu</li>
                    <li>الهاتف: +20 123 456 7890</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Advisor Card - Show if advisor exists (regardless of login status for info) */}
            {university?.advisor && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                  المرشد الأكاديمي المسؤول
                </h3>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {/* Placeholder for advisor image if available */}
                    <span className="text-xl font-semibold">
                      {university.advisor.name ? university.advisor.name.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                  <div className="ml-4 text-right flex-grow">
                    <p className="font-semibold">{university.advisor.name || "مرشد أكاديمي"}</p>
                    <p className="text-gray-600 text-sm">
                      أضاف هذه الجامعة
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Universities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                جامعات مشابهة
              </h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="h-14 w-14 bg-gray-200 rounded-md flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/56"
                      alt="University"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">جامعة العلوم الحديثة</p>
                    <p className="text-gray-600 text-sm">القاهرة، مصر</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-14 w-14 bg-gray-200 rounded-md flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/56"
                      alt="University"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">جامعة التكنولوجيا</p>
                    <p className="text-gray-600 text-sm">الإسكندرية، مصر</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-14 w-14 bg-gray-200 rounded-md flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/56"
                      alt="University"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">جامعة المستقبل</p>
                    <p className="text-gray-600 text-sm">الجيزة، مصر</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default UniversityDetails;
