import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Clock,
  FileText,
  ExternalLink,
  Building,
  CheckCircle,
  Share2,
  Bookmark,
  AlertTriangle,
} from "lucide-react";
import {
  getScholarshipById,
  Scholarship,
} from "../services/scholarshipService";

const ScholarshipDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      if (!id) {
        setError("معرف المنحة غير موجود");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getScholarshipById(id);
        setScholarship(data);
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("فشل في تحميل بيانات المنحة");
        setScholarship(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
    window.scrollTo(0, 0);
  }, [id]);

  const calculateDaysRemaining = (deadline: string | undefined) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

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
            to="/scholarships"
            className="mt-4 text-blue-600 hover:underline"
          >
            العودة إلى قائمة المنح
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!scholarship) {
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
              المنحة المطلوبة غير موجودة.
            </span>
          </div>
          <Link
            to="/scholarships"
            className="mt-4 text-blue-600 hover:underline"
          >
            العودة إلى قائمة المنح
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(scholarship.deadline);
  const eligibilityItems =
    typeof scholarship.eligibility === "string"
      ? scholarship.eligibility.split("\n").filter((item) => item.trim() !== "")
      : [];
  const requirementsItems =
    typeof scholarship.requirements === "string"
      ? scholarship.requirements
          .split("\n")
          .filter((item) => item.trim() !== "")
      : [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-12">
            <div className="max-w-4xl mx-auto flex flex-col items-end">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm mb-4">
                {scholarship.type}
              </span>
              <h1 className="text-4xl font-bold mb-4 text-right">
                {scholarship.name}
              </h1>
              <div className="flex items-center">
                <span className="text-lg font-medium">
                  تقدمها: {scholarship.provider}
                </span>
                <Building className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

          {scholarship.image && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={scholarship.image}
                alt={scholarship.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition duration-300"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      isSaved ? "text-blue-600 fill-current" : "text-gray-700"
                    }`}
                  />
                </button>
                <button className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition duration-300">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  وصف المنحة
                </h2>
                <p className="text-gray-600 text-right leading-relaxed">
                  {scholarship.description}
                </p>
              </section>

              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  شروط الأهلية
                </h2>
                <div className="space-y-3">
                  {eligibilityItems.length > 0 ? (
                    eligibilityItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-end"
                      >
                        <span className="text-gray-600">{item}</span>
                        <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-right">غير محددة.</p>
                  )}
                </div>
              </section>

              {requirementsItems.length > 0 && (
                <section className="bg-white p-6 rounded-xl border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                    متطلبات التقديم
                  </h2>
                  <div className="space-y-3">
                    {requirementsItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-end"
                      >
                        <span className="text-gray-600">{item}</span>
                        <FileText className="w-5 h-5 ml-2 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <p className="text-gray-700 mb-4">
                  هل أنت مستعد للتقديم على هذه المنحة؟
                </p>
                <a
                  href={scholarship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <span className="ml-2">تقديم طلب الآن</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  تفاصيل المنحة
                </h3>
                <div className="space-y-4">
                  {scholarship.amount && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">{scholarship.amount}</p>
                        <p className="text-sm text-gray-500">قيمة المنحة</p>
                      </div>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">
                        {scholarship.deadline
                          ? new Date(scholarship.deadline).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "غير محدد"}
                      </p>
                      <p className="text-sm text-gray-500">آخر موعد للتقديم</p>
                    </div>
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  {scholarship.country && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">{scholarship.country}</p>
                        <p className="text-sm text-gray-500">الموقع</p>
                      </div>
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{scholarship.provider}</p>
                      <p className="text-sm text-gray-500">المؤسسة المانحة</p>
                    </div>
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  {scholarship.fieldOfStudy && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">
                          {scholarship.fieldOfStudy}
                        </p>
                        <p className="text-sm text-gray-500">مجال الدراسة</p>
                      </div>
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  {scholarship.coverage && scholarship.coverage.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-md font-semibold text-gray-700 mb-2 text-right">
                        التغطية
                      </h4>
                      <div className="space-y-2">
                        {scholarship.coverage.map((cov, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-end"
                          >
                            <span className="text-gray-600 text-sm">{cov}</span>
                            <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-600 p-6 rounded-xl text-white">
                <h3 className="text-xl font-semibold mb-3 text-right">
                  الوقت المتبقي للتقديم
                </h3>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-4xl font-bold mb-1">
                      {daysRemaining}
                    </span>
                    <span className="text-sm opacity-80">يوم</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-80">
                    لا تفوت هذه الفرصة، قدم طلبك اليوم!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScholarshipDetails;
