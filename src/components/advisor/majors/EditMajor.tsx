import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getMajorById,
  updateMajor,
  Major,
} from "../../../services/majorService";
import { useAuth } from "../../../contexts/useAuth";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import { Save, ArrowRight, AlertTriangle, Check } from "lucide-react";

const EditMajor: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Major ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const [major, setMajor] = useState<Partial<Major>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajor = async () => {
      if (!id) {
        setError("معرف التخصص غير موجود");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getMajorById(id);
        // Optional: Add authorization check if backend doesn't handle it fully
        // e.g., check if data.college?.university?.advisorId === user?.id
        setMajor(data);
      } catch (err) {
        setError("فشل في تحميل بيانات التخصص");
        console.error("Error fetching major:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMajor();
  }, [id, user?.id]); // Add user?.id if authorization check is added

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMajor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!major.name?.trim()) {
      setError("اسم التخصص مطلوب.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Prepare data for update (only send fields that can be updated)
    const dataToUpdate: Partial<Omit<Major, "id" | "collegeId" | "college">> = {
      name: major.name,
      description: major.description,
    };

    try {
      await updateMajor(id, dataToUpdate);
      setSuccess("تم تحديث التخصص بنجاح!");
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate(`/universities/manage`); // Navigate back to the management page
      }, 1500);
    } catch (err) {
      setError("فشل في تحديث التخصص");
      console.error("Error updating major:", err);
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

  // Initial error (e.g., ID missing, fetch failed)
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">تعديل بيانات التخصص</h1>
            <button
              onClick={() => navigate(`/universities/manage`)}
              className="bg-white text-blue-600 py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للإدارة
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
            {/* Major Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                اسم التخصص *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={major.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الوصف (اختياري)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={major.description || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default EditMajor;
