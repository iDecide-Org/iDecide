import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import jobs from "../data/jobs";
import {
  Search,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Filter,
} from "lucide-react";

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("");

  const jobFields = [
    {
      name: "تكنولوجيا المعلومات",
      image:
        "https://www.rasmussen.edu/images/rasmussenlibraries/blogs/work-from-home-tech-jobs-s.jpg", // Technology/IT image
    },
    {
      name: "الهندسة",
      image:
        "https://storables.com/wp-content/uploads/2023/11/why-is-it-called-civil-engineering-1699953005.jpg", // Engineering image
    },
    {
      name: "الطب والرعاية الصحية",
      image:
        "https://cdn.prod.website-files.com/6466101d017ab9d60c8d0137/65df25f0a339915ec6c00de7_Out%20of%20Hospital%20Costs_Savings%20for%20Medical%20Schemes.jpg", // Healthcare image
    },
    {
      name: "التعليم",
      image:
        "https://education.illinoisstate.edu/images/academics/teaching-learning/teacher-learning-hero.jpg", // Education image
    },
    {
      name: "الأعمال والإدارة",
      image:
        "https://cloudinary.hbs.edu/hbsit/image/upload/s--GpBHn1g1--/f_auto,c_fill,h_375,w_750,/v20200101/DDB997885D475494DB0A0440F658772C.jpg", // Business image
    },
    {
      name: "العلوم",
      image:
        "https://www.lawsonstate.edu/_resources/assets/img/sciencebanner.jpg", // Science image
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.includes(searchTerm) || job.description.includes(searchTerm);
    const matchesField = selectedField ? job.field === selectedField : true;
    return matchesSearch && matchesField;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            استكشف المسارات الوظيفية المستقبلية
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            تعرف على الوظائف المطلوبة ومتطلباتها ومستقبلها في سوق العمل
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن وظيفة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-10 pl-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                dir="rtl"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
              onClick={() => setSelectedField("")}
            >
              <Filter className="w-5 h-5" />
              إعادة تعيين
            </button>
          </div>
        </div>
      </section>

      {/* Job Fields Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
            المجالات الوظيفية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobFields.map((field) => (
              <button
                key={field.name}
                onClick={() =>
                  setSelectedField((prev) =>
                    prev === field.name ? "" : field.name
                  )
                }
                className={`p-6 rounded-xl text-right transition duration-300 relative overflow-hidden group ${
                  selectedField === field.name
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={field.image}
                    alt={field.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">{field.name}</h3>
                  <p className="text-sm opacity-80">اكتشف الوظائف المتاحة</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
            الوظائف المتاحة ({filteredJobs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {job.field}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {job.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-right">
                  {job.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">{job.education}</span>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">{job.salary}</span>
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">{job.growth}</span>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
