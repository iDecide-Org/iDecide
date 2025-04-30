import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getScholarshipById,
  updateScholarship,
  Scholarship,
} from "../../../services/scholarshipService";
import { useAuth } from "../../../contexts/useAuth";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import { Save, ArrowRight, AlertTriangle, Check } from "lucide-react";
enum ScholarshipType {
  FULL = "كاملة",
  PARTIAL = "جزئية",
}

enum ScholarshipCoverage {
  TUITION = "رسوم دراسية",
  LIVING_EXPENSES = "مصاريف معيشة",
  TRAVEL = "سفر",
  OTHER = "أخرى",
}
const EditScholarship: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming useAuth provides the logged-in user
  const [scholarship, setScholarship] = useState<Partial<Scholarship>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        // Basic check: Ensure the fetched scholarship belongs to the logged-in advisor
        // More robust checks might be needed depending on your auth setup
        if (data.advisorId !== user?.id) {
          setError("غير مصرح لك بتعديل هذه المنحة.");
          setLoading(false);
          // Optionally redirect
          // navigate('/advisor/dashboard');
          return;
        }
        // Format deadline for input type="date"
        const formattedDeadline = data.deadline
          ? new Date(data.deadline).toISOString().split("T")[0]
          : "";
        setScholarship({ ...data, deadline: formattedDeadline });
      } catch (err) {
        setError("فشل في تحميل بيانات المنحة");
        console.error("Error fetching scholarship:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id, user?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setScholarship((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentCoverage = scholarship.coverage || [];
    if (checked) {
      setScholarship((prev) => ({
        ...prev,
        coverage: [...currentCoverage, value as ScholarshipCoverage],
      }));
    } else {
      setScholarship((prev) => ({
        ...prev,
        coverage: currentCoverage.filter((c) => c !== value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Clone the scholarship state to prepare the update payload
    const dataToUpdate: Partial<Scholarship> = { ...scholarship };

    // Remove properties that should not be sent in the update payload
    delete dataToUpdate.id;
    delete dataToUpdate.advisorId;
    delete dataToUpdate.createdAt;
    delete dataToUpdate.university; // Remove the nested university object if present

    // Convert deadline back to ISO string or keep as is if not changed significantly
    if (dataToUpdate.deadline && typeof dataToUpdate.deadline === "string") {
      // Assuming the input gives 'YYYY-MM-DD', append time for ISO string
      dataToUpdate.deadline = new Date(dataToUpdate.deadline).toISOString();
    }

    try {
      await updateScholarship(id, dataToUpdate); // Send the cleaned data
      setSuccess("تم تحديث المنحة بنجاح!");
      // Optionally redirect after a delay
      setTimeout(() => {
        // Redirect back to the university management page or scholarship list
        // Assuming the advisor manages scholarships via the university page
        if (scholarship.universityId) {
          navigate(`/universities/manage`); // Or a specific scholarship list page
        } else {
          navigate("/advisor/dashboard"); // Fallback
        }
      }, 2000);
    } catch (err) {
      setError("فشل في تحديث المنحة");
      console.error("Error updating scholarship:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Initial error (e.g., ID missing, fetch failed, unauthorized)
  if (error && !submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center"
            role="alert"
          >
            <strong className="font-bold">خطأ!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <Link
            to="/universities/manage"
            className="mt-4 text-blue-600 hover:underline"
          >
            العودة إلى إدارة الجامعة
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">تعديل منحة دراسية</h1>
            <button
              onClick={() => navigate(`/universities/manage`)} // Adjust if needed
              className="bg-white text-blue-600 py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة
            </button>
          </div>

          {error &&
            submitting && ( // Show submission errors here
              <div className="m-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

          {success && (
            <div className="m-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Scholarship Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                اسم المنحة *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={scholarship.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Provider */}
            <div>
              <label
                htmlFor="provider"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                مقدم المنحة (الجامعة/المؤسسة) *
              </label>
              <input
                type="text"
                id="provider"
                name="provider"
                required
                value={scholarship.provider || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                نوع المنحة *
              </label>
              <select
                id="type"
                name="type"
                required
                value={scholarship.type || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر النوع</option>
                {Object.values(ScholarshipType).map((type) => (
                  <option key={type} value={type}>
                    {type === ScholarshipType.FULL ? "كاملة" : "جزئية"}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الوصف *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={scholarship.description || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Eligibility */}
            <div>
              <label
                htmlFor="eligibility"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                شروط الأهلية *
              </label>
              <textarea
                id="eligibility"
                name="eligibility"
                required
                rows={3}
                value={scholarship.eligibility || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اذكر الشروط، كل شرط في سطر جديد"
              />
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الموعد النهائي للتقديم *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                required
                value={scholarship.deadline || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label
                htmlFor="link"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                رابط التقديم/التفاصيل *
              </label>
              <input
                type="url"
                id="link"
                name="link"
                required
                value={scholarship.link || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
                placeholder="https://example.com/scholarship"
              />
            </div>

            {/* Coverage */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                التغطية (اختياري)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(ScholarshipCoverage).map((cov) => (
                  <label
                    key={cov}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <input
                      type="checkbox"
                      name="coverage"
                      value={cov}
                      checked={scholarship.coverage?.includes(cov)}
                      onChange={handleCoverageChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span>{cov}</span>{" "}
                    {/* Display enum value directly, consider mapping to Arabic */}
                  </label>
                ))}
              </div>
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الدولة المستهدفة (اختياري)
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={scholarship.country || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: مصر"
              />
            </div>

            {/* Field of Study */}
            <div>
              <label
                htmlFor="fieldOfStudy"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                مجال الدراسة المستهدف (اختياري)
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={scholarship.fieldOfStudy || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: الهندسة، الطب"
              />
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditScholarship;
