import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  ExternalLink,
  MapPin,
  Building,
} from "lucide-react";

interface JoobleJob {
  id: string;
  title: string;
  location: string;
  company: string;
  description: string;
  link: string;
  salary?: string;
  type?: string;
  updated?: string;
}

const JobDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JoobleJob | null>(location.state?.job || null);

  useEffect(() => {
    if (!location.state?.job && id) {
      console.warn("Job details loaded without state. Data might be missing.");
    }
    if (location.state?.job && !job) {
      setJob(location.state.job);
    }

    window.scrollTo(0, 0);
  }, [id, location.state, job]);

  if (!job) {
    return (
      <div
        className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center"
        dir="rtl"
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-2xl text-gray-700 font-semibold mb-4">
              الوظيفة غير موجودة أو لا يمكن تحميلها
            </h2>
            <p className="text-gray-600 mb-6">
              قد يكون الرابط غير صحيح أو أن الوظيفة لم تعد متاحة.
            </p>
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              العودة إلى صفحة الوظائف
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen"
      dir="rtl"
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4 text-right">
                {job.title}
              </h1>
              <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {job.company || "غير محدد"}
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                {job.type && (
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    {job.type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  وصف الوظيفة
                </h2>
                <div
                  className="text-gray-600 text-right leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </section>

              <section className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
                <p className="text-gray-700 mb-4">هل أنت مهتم بهذه الوظيفة؟</p>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <span className="ml-2">عرض الوظيفة / التقديم</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  تفاصيل الوظيفة
                </h3>
                <div className="space-y-4">
                  {job.salary && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">{job.salary}</p>
                        <p className="text-sm text-gray-500">الراتب</p>
                      </div>
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{job.location}</p>
                      <p className="text-sm text-gray-500">الموقع</p>
                    </div>
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">
                        {job.company || "غير محدد"}
                      </p>
                      <p className="text-sm text-gray-500">الشركة</p>
                    </div>
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  {job.updated && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-gray-600">
                          {new Date(job.updated).toLocaleDateString("ar-EG")}
                        </p>
                        <p className="text-sm text-gray-500">تاريخ التحديث</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
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

export default JobDetails;
