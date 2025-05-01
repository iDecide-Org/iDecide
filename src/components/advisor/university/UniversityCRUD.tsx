import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdvisorUniversities,
  deleteUniversity,
  University,
  getImageUrl,
} from "../../../services/universityService";
import { useAuth } from "../../../contexts/useAuth";
import {
  Edit,
  Plus,
  Trash2,
  Building,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";

export const UniversityCRUD: React.FC = () => {
  const navigate = useNavigate();
  const { isAdvisor, user } = useAuth(); // Get user info for potential checks
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure user is an advisor before fetching
    if (isAdvisor === false) {
      navigate("/"); // Redirect if not advisor
      return;
    }
    if (isAdvisor === null) {
      // Still loading auth status
      return;
    }

    const fetchUniversity = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdvisorUniversities();
        if (data.length > 0) {
          setUniversity(data[0]); // Advisor should only have one university
        } else {
          setUniversity(null); // No university found for this advisor
        }
      } catch (err) {
        console.error("Error fetching advisor university:", err);
        setError("فشل في تحميل بيانات الجامعة");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [isAdvisor, navigate]);

  const handleAddUniversity = () => {
    navigate("/universities/add");
  };

  const handleEditUniversity = () => {
    if (university) {
      navigate(`/universities/edit/${university.id}`);
    }
  };

  const handleDeleteUniversity = async () => {
    if (
      university &&
      window.confirm(
        "هل أنت متأكد من حذف هذه الجامعة؟ سيتم حذف جميع الكليات والتخصصات والمنح المرتبطة بها."
      )
    ) {
      try {
        setLoading(true); // Indicate loading during deletion
        setError(null);
        await deleteUniversity(university.id);
        setUniversity(null); // Clear university from state after deletion
        // Optionally show a success message
      } catch (err) {
        setError("فشل في حذف الجامعة");
        console.error("Error deleting university:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Title and Add Button (if no university exists yet) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">إدارة الجامعة</h3>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10 flex-grow">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">جاري تحميل بيانات الجامعة...</p>
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {/* University Details Display */}
      {!loading && !error && university && (
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={getImageUrl(university.image)}
                alt={`شعار ${university.name}`}
              />
            </div>
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                    {university.type || "جامعة"}
                  </div>
                  <h4 className="block mt-1 text-lg leading-tight font-bold text-black">
                    {university.name}
                  </h4>
                  <p className="mt-2 text-gray-600 flex items-center text-sm">
                    <MapPin className="w-4 h-4 ml-1 text-gray-500" />{" "}
                    {university.location}
                  </p>
                  <p className="mt-1 text-gray-600 flex items-center text-sm">
                    <Calendar className="w-4 h-4 ml-1 text-gray-500" /> تأسست
                    عام: {university.establishment || "غير معروف"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                  <button
                    onClick={handleEditUniversity}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-md hover:bg-indigo-100 flex items-center text-sm"
                    title="تعديل بيانات الجامعة"
                  >
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </button>
                  <button
                    onClick={handleDeleteUniversity}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-md hover:bg-red-100 flex items-center text-sm"
                    title="حذف الجامعة"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-700 text-sm">
                {university.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="w-4 h-4 ml-1 text-blue-500" />{" "}
                  {university.collegesCount || 0}+ كليات
                </span>
                <span className="flex items-center">
                  <Info className="w-4 h-4 ml-1 text-blue-500" />{" "}
                  {university.majorsCount || 0}+ تخصصات
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder when no university exists */}
      {!loading && !error && !university && (
        <div className="flex flex-col items-center justify-center text-center flex-grow">
          <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-1">
            لم تقم بإضافة جامعة بعد
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            ابدأ بإضافة تفاصيل جامعتك لإدارة الكليات والتخصصات والمنح.
          </p>
          <button
            onClick={handleAddUniversity}
            className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center shadow-sm text-sm"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة جامعة الآن
          </button>
        </div>
      )}
    </>
  );
};
