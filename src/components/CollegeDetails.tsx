import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Building,
  Link as LinkIcon,
  GraduationCap,
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { getCollegeById, College } from "../services/collegeService";
import { getImageUrl } from "../services/universityService"; // Assuming university image might be relevant

const CollegeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollege = async () => {
      if (!id) {
        setError("معرف الكلية غير موجود");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getCollegeById(id);
        setCollege(data);
      } catch (err) {
        console.error("Error fetching college:", err);
        setError("فشل في تحميل بيانات الكلية");
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center"
            role="alert"
          >
            <strong className="font-bold">خطأ!</strong>
            <span className="block sm:inline"> {error}</span>
            <AlertTriangle className="inline w-5 h-5 mr-2" />
          </div>
          <Link
            to="/universities" // Link back to universities list or relevant page
            className="mt-4 text-blue-600 hover:underline"
          >
            العودة إلى قائمة الجامعات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md text-center"
            role="alert"
          >
            <strong className="font-bold">تنبيه!</strong>
            <span className="block sm:inline">
              {" "}
              الكلية المطلوبة غير موجودة.
            </span>
          </div>
          <Link
            to="/universities" // Link back
            className="mt-4 text-blue-600 hover:underline"
          >
            العودة إلى قائمة الجامعات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Assuming university might have an image to display as a banner
  const bannerImage = college.university?.image
    ? getImageUrl(college.university.image)
    : "https://via.placeholder.com/1200x300?text=College+Banner"; // Placeholder

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Optional Banner - Could use university image */}
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center px-4">
                {college.name}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span>عن الكلية</span>
                </h2>
                <p className="text-gray-600 text-right leading-relaxed">
                  {college.description || "لا يوجد وصف متاح حالياً."}
                </p>
              </section>

              {/* Majors Section */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <span>التخصصات المتاحة</span>
                </h2>
                <div className="space-y-3">
                  {college.majors && college.majors.length > 0 ? (
                    college.majors.map((major) => (
                      <div
                        key={major.id}
                        className="flex items-center justify-end p-3 bg-gray-50 rounded-md"
                      >
                        <span className="text-gray-700 font-medium">
                          {major.name}
                        </span>
                        {/* Potential: Link to major details if available */}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-right">
                      لم يتم إضافة تخصصات لهذه الكلية بعد.
                    </p>
                  )}
                </div>
              </section>

              {/* Link to University */}
              {college.university && (
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <p className="text-gray-700 mb-4">
                    هذه الكلية تابعة لـ{" "}
                    <span className="font-semibold">
                      {college.university.name}
                    </span>
                    .
                  </p>
                  <Link
                    to={`/university-details/${college.universityId}`}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    <span className="ml-2">عرض تفاصيل الجامعة</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  معلومات الكلية
                </h3>
                <div className="space-y-4">
                  {/* University Name */}
                  {college.university && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">
                          {college.university.name}
                        </p>
                        <p className="text-sm text-gray-500">الجامعة</p>
                      </div>
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                  )}

                  {/* Location */}
                  {college.location && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">{college.location}</p>
                        <p className="text-sm text-gray-500">الموقع</p>
                      </div>
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  )}

                  {/* Website */}
                  {college.website && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block max-w-[200px]"
                          title={college.website}
                        >
                          {college.website}
                        </a>
                        <p className="text-sm text-gray-500">
                          الموقع الإلكتروني
                        </p>
                      </div>
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Placeholder for potential actions or related info */}
              {/* <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">
                  روابط سريعة
                </h3>
                </div> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollegeDetails;
