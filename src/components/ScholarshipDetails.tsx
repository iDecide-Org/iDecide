import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useLocation, useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import scholarships from "../data/scholarshipsData";

const ScholarshipDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState(location.state?.scholarship);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Try to find scholarship from URL parameter if state is missing
    if (!scholarship && id) {
      const foundScholarship = scholarships.find((s) => s.id.toString() === id);
      setScholarship(foundScholarship);
    }

    window.scrollTo(0, 0);
  }, [id, scholarship]);

  // Format deadline to Arabic date format
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  if (!scholarship) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">المنحة غير موجودة</div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(scholarship.deadline);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-12">
            <div className="max-w-4xl mx-auto flex flex-col items-end">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm mb-4">
                {scholarship.type}
              </span>
              <h1 className="text-4xl font-bold mb-4 text-right">
                {scholarship.title}
              </h1>
              <div className="flex items-center">
                <span className="text-lg font-medium">
                  تقدمها: {scholarship.organization}
                </span>
                <Building className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={scholarship.image}
              alt={scholarship.title}
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Scholarship Description */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  وصف المنحة
                </h2>
                <p className="text-gray-600 text-right leading-relaxed">
                  {scholarship.description}
                </p>
              </section>

              {/* Eligibility Requirements */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  شروط الأهلية
                </h2>
                <div className="space-y-3">
                  {scholarship.eligibility.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-end"
                      >
                        <span className="text-gray-600">{item}</span>
                        <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* Application Requirements */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  متطلبات التقديم
                </h2>
                <div className="space-y-3">
                  {scholarship.requirements.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-end"
                      >
                        <span className="text-gray-600">{item}</span>
                        <FileText className="w-5 h-5 ml-2 text-blue-500" />
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* Application Button */}
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <p className="text-gray-700 mb-4">
                  هل أنت مستعد للتقديم على هذه المنحة؟
                </p>
                <a
                  href={scholarship.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <span className="ml-2">تقديم طلب الآن</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scholarship Details Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  تفاصيل المنحة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{scholarship.amount}</p>
                      <p className="text-sm text-gray-500">قيمة المنحة</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">
                        {formatDeadline(scholarship.deadline)}
                      </p>
                      <p className="text-sm text-gray-500">آخر موعد للتقديم</p>
                    </div>
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{scholarship.location}</p>
                      <p className="text-sm text-gray-500">الموقع</p>
                    </div>
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">
                        {scholarship.organization}
                      </p>
                      <p className="text-sm text-gray-500">المؤسسة المانحة</p>
                    </div>
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Countdown Card */}
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

              {/* Similar Scholarships */}
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  منح مشابهة
                </h3>
                <div className="space-y-4">
                  {scholarships
                    .filter(
                      (s) =>
                        s.id !== scholarship.id && s.type === scholarship.type
                    )
                    .slice(0, 3)
                    .map((similar) => (
                      <Link
                        key={similar.id}
                        to={`/scholarships/${similar.id}`}
                        state={{ scholarship: similar }}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300"
                      >
                        <h4 className="font-medium text-gray-800 mb-1 text-right">
                          {similar.title}
                        </h4>
                        <div className="flex items-center justify-end text-sm text-gray-600">
                          <span>{similar.organization}</span>
                          <Award className="w-4 h-4 ml-1 text-blue-600" />
                        </div>
                      </Link>
                    ))}
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
