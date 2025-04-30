import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  AlertTriangle,
  Edit,
  Building,
  GraduationCap,
  Award,
  Home,
} from "lucide-react";
import Navbar from "../NavBar";
import Footer from "../Footer";
import {
  getAdvisorUniversities,
  University,
} from "../../services/universityService";
import { useAuth } from "../../contexts/useAuth";

import { CollegesCRUD } from "./CollegesCRUD";
import { MajorsCRUD } from "./MajorsCRUD";
import { ScholarshipsCRUD } from "./scholarship/ScholarshipsCRUD";

// --- Colleges CRUD Component ---

// --- Majors CRUD Component ---

// --- Scholarships CRUD Component ---

// --- Main ManageUniversities Component ---
const ManageUniversities: React.FC = () => {
  const navigate = useNavigate();
  const { isAdvisor, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [activeTab, setActiveTab] = useState<string>("university");

  useEffect(() => {
    if (isAdvisor === false) {
      navigate("/");
      return;
    }
    if (isAdvisor === null || isAdvisor === undefined) {
      setLoading(true);
      return;
    }

    const checkAdvisorUniversity = async () => {
      setLoading(true);
      setError(null);
      setUniversity(null);
      try {
        const data = await getAdvisorUniversities();
        if (data.length > 0 && data[0]?.id) {
          setUniversity(data[0]);
        }
      } catch (err) {
        console.error("Error checking advisor university:", err);
        setError("فشل في التحقق من بيانات الجامعة");
      } finally {
        setLoading(false);
      }
    };

    checkAdvisorUniversity();
  }, [isAdvisor, navigate]);

  const renderTabContent = () => {
    if (!university) return null;

    switch (activeTab) {
      case "university":
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md mx-auto">
            <Home className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              نظرة عامة على الجامعة
            </h3>
            <p className="text-gray-600 mb-1">
              <strong>الاسم:</strong> {university.name}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>الموقع:</strong> {university.location}
            </p>
            <Link
              to={`/universities/edit/${university.id}`}
              className="mt-4 inline-flex items-center bg-indigo-600 text-white py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4 ml-1" />
              تعديل بيانات الجامعة
            </Link>
          </div>
        );
      case "colleges":
        return <CollegesCRUD universityId={university.id} />;
      case "majors":
        return <MajorsCRUD universityId={university.id} />;
      case "scholarships":
        return <ScholarshipsCRUD universityId={university.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center max-w-lg mx-auto">
            <AlertTriangle className="w-5 h-5 ml-2" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && !university && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center max-w-md mx-auto">
              <div className="mx-auto h-20 w-20 text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                لا توجد جامعة مرتبطة بحسابك
              </h3>
              <p className="text-gray-500 mt-2 mb-6">
                لم تقم بإضافة جامعة بعد. يرجى إضافة جامعتك للمتابعة.
              </p>
              <Link
                to="/universities/add"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 ml-1" />
                إضافة جامعة
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && university && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-blue-600 text-white">
              <h1 className="text-2xl font-bold text-right">
                إدارة الجامعة: {university.name}
              </h1>
            </div>

            <div className="flex border-b border-gray-200 justify-center">
              <button
                onClick={() => setActiveTab("university")}
                className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                  activeTab === "university"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Home className="w-4 h-4 ml-1" /> الجامعة
              </button>
              <button
                onClick={() => setActiveTab("colleges")}
                className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                  activeTab === "colleges"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Building className="w-4 h-4 ml-1" /> الكليات
              </button>
              <button
                onClick={() => setActiveTab("majors")}
                className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                  activeTab === "majors"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <GraduationCap className="w-4 h-4 ml-1" /> التخصصات
              </button>
              <button
                onClick={() => setActiveTab("scholarships")}
                className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                  activeTab === "scholarships"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Award className="w-4 h-4 ml-1" /> المنح الدراسية
              </button>
            </div>

            <div className="p-6 bg-gray-50 min-h-[400px]">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageUniversities;
