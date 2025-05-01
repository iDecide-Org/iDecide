import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Award,
  Clock,
  ExternalLink,
} from "lucide-react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import {
  getUniversityById,
  getImageUrl,
  University,
} from "../services/universityService";
import {
  addFavoriteUniversity,
  removeFavoriteUniversity,
  isUniversityInFavorites,
} from "../services/favoriteService";
import { useAuth } from "../contexts/useAuth";
import { Scholarship } from "../services/scholarshipService";
import { College } from "../services/collegeService";

const UniversityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("about");
  const { isLoggedIn, isAdvisor } = useAuth();

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getUniversityById(id);

        setUniversity(data);

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

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      setError("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  const handleStartChat = () => {
    if (!isLoggedIn || isAdvisor || !university?.advisor?.id) return;
    navigate(`/chat/${university.advisor.id}`);
  };

  const tabs = [
    { id: "about", label: "عن الجامعة" },
    { id: "colleges", label: "الكليات" },
    { id: "admission", label: "شروط القبول" },
    // { id: "fees", label: "المصروفات" },
    { id: "scholarships", label: "المنح الدراسية" },
    { id: "location", label: "موقع الجامعة" },
    { id: "contact", label: "التواصل" },
  ];

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
              <Link
                to="/universities"
                className="text-blue-600 hover:underline"
              >
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

        {university && (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden f">
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
                      <h1 className="text-3xl md:text-4xl font-bold">
                        {university.name}
                      </h1>
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
                              isFavorite
                                ? "fill-current text-red-500"
                                : "text-white"
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

            <div className=" bg-white rounded-xl shadow-md overflow-x-auto">
              <div className="flex border-b border-gray-200" dir="rtl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-5 text-sm font-medium whitespace-nowrap focus:outline-none ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">
              {activeTab === "about" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                    عن الجامعة
                  </h2>
                  <div className="prose max-w-none text-right">
                    <p className="text-gray-700">
                      {university.description || "لا يوجد وصف متاح حالياً."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "colleges" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">
                    الكليات والتخصصات
                  </h2>
                  {university.colleges && university.colleges.length > 0 ? (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      dir="rtl"
                    >
                      {university.colleges.map((college: College) => (
                        <div
                          key={college.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                        >
                          <div className="p-4 flex-grow">
                            <h3
                              className="text-lg font-semibold text-blue-700 mb-2 text-right truncate"
                              title={college.name}
                            >
                              {college.name}
                            </h3>
                            {college.location && (
                              <p className="text-sm text-gray-500 mb-3 text-right flex items-center justify-end gap-1">
                                <span>{college.location}</span>
                                <MapPin className="w-4 h-4" />
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mb-4 text-right line-clamp-3">
                              {college.description || "لا يوجد وصف متاح."}
                            </p>
                          </div>
                          <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
                            {college.website && (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              >
                                <span>الموقع الإلكتروني</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <Link
                              to={`/college-details/${college.id}`}
                              className="text-xs text-gray-600 hover:text-black"
                            >
                              عرض التفاصيل
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        لم يتم إضافة كليات لهذه الجامعة بعد.
                      </p>
                      {isAdvisor && (
                        <Link
                          to={`/universities/manage`}
                          className="mt-4 inline-block text-blue-600 hover:underline"
                        >
                          إدارة الكليات
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "admission" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                    شروط القبول
                  </h2>
                  <div className="prose max-w-none text-right">
                    {university.admissionRequirements ? (
                      <ul className="list-disc list-inside space-y-2">
                        {university.admissionRequirements
                          .split("\n")
                          .map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">
                        لا توجد معلومات عن شروط القبول حالياً.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* {activeTab === "fees" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                    المصروفات الدراسية
                  </h2>
                  <div className="prose max-w-none text-right">
                    <p className="text-gray-700">
                      {university.tuitionFees ||
                        "لا توجد معلومات عن المصروفات حالياً."}
                    </p>
                  </div>
                </div>
              )} */}

              {activeTab === "scholarships" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">
                    المنح الدراسية المتاحة
                  </h2>
                  {university.scholarships &&
                  university.scholarships.length > 0 ? (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      dir="rtl"
                    >
                      {university.scholarships.map(
                        (scholarship: Scholarship) => (
                          <div
                            key={scholarship.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="p-4">
                              <h3
                                className="text-lg font-semibold text-blue-700 mb-2 text-right truncate"
                                title={scholarship.name}
                              >
                                {scholarship.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1 text-right">
                                مقدمة من: {scholarship.provider}
                              </p>
                              <div className="flex justify-end items-center text-sm text-gray-500 mb-3 gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    scholarship.type === "كاملة"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {scholarship.type}
                                </span>
                                <Award className="w-4 h-4" />
                              </div>
                              <div className="flex justify-end items-center text-sm text-gray-500 mb-4 gap-2">
                                <span>
                                  آخر موعد:{" "}
                                  {scholarship.deadline
                                    ? new Date(
                                        scholarship.deadline
                                      ).toLocaleDateString("ar-EG")
                                    : "غير محدد"}
                                </span>
                                <Clock className="w-4 h-4" />
                              </div>
                              <Link
                                to={`/scholarships/${scholarship.id}`}
                                className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition duration-300 text-sm"
                              >
                                عرض التفاصيل
                              </Link>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        لا توجد منح دراسية متاحة حالياً لهذه الجامعة.
                      </p>
                      <Link
                        to="/scholarships"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                      >
                        تصفح جميع المنح
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "location" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                    موقع الجامعة على الخريطة
                  </h2>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map Placeholder</p>
                  </div>
                  <p className="mt-4 text-gray-700 text-right">
                    العنوان: {university.location}
                  </p>
                </div>
              )}

              {activeTab === "contact" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                    التواصل مع الجامعة
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-right">
                        معلومات الاتصال
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-right">
                        <li>
                          <span> الموقع الإلكتروني: {"  "}</span>
                          {university.website ? (
                            <a
                              href={university.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {university.website}
                            </a>
                          ) : (
                            "غير متوفر"
                          )}
                        </li>
                        {/* <li>البريد الإلكتروني: غير متوفر</li>
                        <li>الهاتف: غير متوفر</li> */}

                        <li>
                          الهاتف: {"  "}
                          {university.phone ? (
                            <a
                              href={`tel:${university.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {university.phone}
                            </a>
                          ) : (
                            "غير متوفر"
                          )}
                        </li>
                        <li>
                          البريد الإلكتروني:{" "}
                          {university.email ? (
                            <a
                              href={`mailto:${university.email}`}
                              className="text-blue-600 hover:underline "
                            >
                              {university.email}
                            </a>
                          ) : (
                            "غير متوفر"
                          )}
                        </li>
                      </ul>
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center mt-6">
                        <p className="mb-2">
                          هل تريد معلومات إضافية عن الجامعة؟
                        </p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full">
                          طلب معلومات
                        </button>
                      </div>
                    </div>

                    <div>
                      {university?.advisor && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                            المرشد الأكاديمي المسؤول
                          </h3>
                          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                              <span className="text-xl font-semibold">
                                {university.advisor.name
                                  ? university.advisor.name
                                      .charAt(0)
                                      .toUpperCase()
                                  : "A"}
                              </span>
                            </div>
                            <div className="mr-4 text-right flex-grow">
                              <p className="font-semibold">
                                {university.advisor.name || "مرشد أكاديمي"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                أضاف هذه الجامعة
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {isLoggedIn && !isAdvisor && university?.advisor && (
                        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
                          <p className="mb-2">هل لديك أسئلة محددة؟</p>
                          <button
                            onClick={handleStartChat}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full flex items-center justify-center"
                          >
                            <MessageSquare className="w-4 h-4 ml-2" />
                            <span>دردشة مع المرشد الأكاديمي</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default UniversityDetails;
