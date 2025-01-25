const jobs: Job[] = [
  {
    id: 1,
    title: "مهندس برمجيات",
    field: "تكنولوجيا المعلومات",
    description: "تطوير وصيانة تطبيقات البرمجيات وأنظمة الحاسوب",
    skills: ["Java", "Python", "JavaScript", "SQL"],
    salary: "20,000 - 35,000 جنيه",
    education: "بكالوريوس علوم حاسب",
    growth: "15% سنوياً",
  },
  {
    id: 2,
    title: "طبيب أسنان",
    field: "الطب والرعاية الصحية",
    description: "تشخيص وعلاج مشاكل الأسنان والفم",
    skills: ["مهارات يدوية", "تشخيص", "رعاية المرضى"],
    salary: "30,000 - 50,000 جنيه",
    education: "بكالوريوس طب أسنان",
    growth: "12% سنوياً",
  },
  {
    id: 3,
    title: "مدير مشروع",
    field: "الأعمال والإدارة",
    description: "تخطيط وتنفيذ المشاريع وإدارة الفرق",
    skills: ["التخطيط", "التنظيم", "التواصل"],
    salary: "25,000 - 40,000 جنيه",
    education: "بكالوريوس إدارة الأعمال",
    growth: "10% سنوياً",
  },
  {
    id: 4,
    title: "معلم رياضيات",
    field: "التعليم",
    description: "تدريس مواد الرياضيات للطلاب",
    skills: ["التواصل", "التحفيز", "التحليل"],
    salary: "15,000 - 25,000 جنيه",
    education: "بكالوريوس تربية",
    growth: "5% سنوياً",
  },
  {
    id: 5,
    title: "مهندس مدني",
    field: "الهندسة",
    description: "تصميم وتنفيذ المشاريع الهندسية",
    skills: ["الرسم الهندسي", "التصميم", "التنفيذ"],
    salary: "20,000 - 35,000 جنيه",
    education: "بكالوريوس هندسة مدنية",
    growth: "8% سنوياً",
  },
  {
    id: 6,
    title: "عالم أبحاث",
    field: "العلوم",
    description: "إجراء الأبحاث العلمية وتحليل البيانات",
    skills: ["البحث", "التحليل", "التقرير"],
    salary: "25,000 - 40,000 جنيه",
    education: "دكتوراه علوم",
    growth: "7% سنوياً",
  },
  {
    id: 7,
    title: "محلل بيانات",
    field: "تكنولوجيا المعلومات",
    description: "تحليل البيانات واستخراج الرؤى لتوجيه القرارات",
    skills: ["SQL", "Python", "تحليل البيانات", "التصور"],
    salary: "22,000 - 38,000 جنيه",
    education: "بكالوريوس علوم حاسب",
    growth: "14% سنوياً",
  },
  {
    id: 8,
    title: "مهندس كهرباء",
    field: "الهندسة",
    description: "تصميم وصيانة الأنظمة الكهربائية",
    skills: ["الرسم الهندسي", "التصميم", "التحليل"],
    salary: "20,000 - 35,000 جنيه",
    education: "بكالوريوس هندسة كهربائية",
    growth: "9% سنوياً",
  },
  {
    id: 9,
    title: "ممرض",
    field: "الطب والرعاية الصحية",
    description: "تقديم الرعاية الصحية للمرضى",
    skills: ["الرعاية الصحية", "التواصل", "التعاطف"],
    salary: "18,000 - 30,000 جنيه",
    education: "بكالوريوس تمريض",
    growth: "11% سنوياً",
  },
  {
    id: 10,
    title: "مدرس لغة إنجليزية",
    field: "التعليم",
    description: "تدريس اللغة الإنجليزية للطلاب",
    skills: ["التواصل", "التدريس", "التحفيز"],
    salary: "15,000 - 25,000 جنيه",
    education: "بكالوريوس تربية",
    growth: "6% سنوياً",
  },
  {
    id: 11,
    title: "محاسب",
    field: "الأعمال والإدارة",
    description: "إدارة الحسابات والميزانيات",
    skills: ["المحاسبة", "التحليل المالي", "التنظيم"],
    salary: "20,000 - 32,000 جنيه",
    education: "بكالوريوس محاسبة",
    growth: "8% سنوياً",
  },
  {
    id: 12,
    title: "عالم بيئة",
    field: "العلوم",
    description: "دراسة البيئة وتقديم الحلول البيئية",
    skills: ["البحث", "التحليل", "التقرير"],
    salary: "23,000 - 37,000 جنيه",
    education: "بكالوريوس علوم بيئية",
    growth: "7% سنوياً",
  },
];

import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import {
  Search,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Filter,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  field: string;
  description: string;
  skills: string[];
  salary: string;
  education: string;
  growth: string;
}

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("");

  const jobFields = [
    "تكنولوجيا المعلومات",
    "الهندسة",
    "الطب والرعاية الصحية",
    "التعليم",
    "الأعمال والإدارة",
    "العلوم",
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
                key={field}
                onClick={() =>
                  setSelectedField((prev) => (prev === field ? "" : field))
                }
                className={`p-6 rounded-xl text-right transition duration-300 ${
                  selectedField === field
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{field}</h3>
                <p className="text-sm opacity-80">اكتشف الوظائف المتاحة</p>
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
