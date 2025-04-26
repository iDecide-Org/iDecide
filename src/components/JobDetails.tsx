import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useLocation, useParams } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import jobs from "../data/jobs"; // Import your jobs data

const JobDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState(location.state?.job);

  useEffect(() => {
    // Try to find job from URL parameter if state is missing
    if (!job && id) {
      const foundJob = jobs.find((j) => j.id.toString() === id);
      setJob(foundJob);
    }

    window.scrollTo(0, 0);
  }, [id, job]);

  if (!job) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-2xl text-gray-600">الوظيفة غير موجودة</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4 text-right">
                {job.title}
              </h1>
              <div className="flex items-center justify-end space-x-4">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                  {job.field}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  وصف الوظيفة
                </h2>
                <p className="text-gray-600 text-right leading-relaxed">
                  {job.description}
                </p>
              </section>

              {/* Required Skills */}
              <section className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">
                  المهارات المطلوبة
                </h2>
                <div className="flex flex-wrap gap-2 justify-end">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Details Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
                  تفاصيل الوظيفة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{job.salary}</p>
                      <p className="text-sm text-gray-500">الراتب المتوقع</p>
                    </div>
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{job.education}</p>
                      <p className="text-sm text-gray-500">المؤهل المطلوب</p>
                    </div>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-gray-600">{job.growth}</p>
                      <p className="text-sm text-gray-500">معدل النمو</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
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
