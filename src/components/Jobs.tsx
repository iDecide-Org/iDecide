import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

import {
  Search,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Filter,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jobFields from "../data/jobFields";

// Define a type for the raw job data from the Jooble API response
// Adjust this based on the actual fields returned by Jooble
interface JoobleApiJob {
  id?: string; // Assuming ID might be optional
  title?: string;
  location?: string;
  company?: string;
  snippet?: string; // Jooble often uses snippet for description preview
  description?: string; // Full description might also be available
  link?: string;
  salary?: string;
  type?: string;
  updated?: string; // Date string
  // Add any other fields you expect from the API
}

// Define a type for the job data used within the application
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

const JOOBLE_API_KEY = "37c0c464-1c6b-4af7-af46-293cab704a26";
const JOOBLE_API_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [jobs, setJobs] = useState<JoobleJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (currentSearchTerm: string) => {
    setIsLoading(true);
    setError(null);
    setJobs([]);

    try {
      const response = await fetch(JOOBLE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: "Egypt",
          keywords: currentSearchTerm || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Map API response to JoobleJob interface
      // Use the specific JoobleApiJob type instead of any
      const mappedJobs: JoobleJob[] = (data.jobs || []).map(
        (apiJob: JoobleApiJob) => ({
          id: apiJob.id || Math.random().toString(36).substring(7), // Generate ID if missing
          title: apiJob.title || "N/A",
          location: apiJob.location || "N/A",
          company: apiJob.company || "N/A",
          description:
            apiJob.snippet || apiJob.description || "No description available.", // Use snippet or description
          link: apiJob.link || "#",
          salary: apiJob.salary || undefined,
          type: apiJob.type || undefined,
          updated: apiJob.updated || undefined,
        })
      );

      setJobs(mappedJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchJobs(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchJobs]);

  const handleJobClick = (job: JoobleJob) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            استكشف المسارات الوظيفية المستقبلية
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            تعرف على الوظائف المطلوبة ومتطلباتها ومستقبلها في سوق العمل
          </p>

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
              إعادة تعيين الفلتر
            </button>
          </div>
        </div>
      </section>

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

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
            الوظائف المتاحة ({isLoading ? "جاري البحث..." : jobs.length})
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>حدث خطأ أثناء البحث: {error}</span>
            </div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {job.company || job.type || "N/A"}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 text-right">
                      {job.title}
                    </h3>
                  </div>
                  <p
                    className="text-gray-600 mb-4 text-right flex-grow"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-700">{job.location}</span>
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    {job.salary && (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-700">{job.salary}</span>
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    {job.updated && (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-700">
                          {new Date(job.updated).toLocaleDateString("ar-EG")}
                        </span>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
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
