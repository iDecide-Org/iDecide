import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createMajor } from "../../../services/majorService";
import { useAuth } from "../../../contexts/useAuth";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import { Save, ArrowRight, AlertTriangle, Check } from "lucide-react";

const AddMajor: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();

  const navigate = useNavigate();
  const { user } = useAuth(); // For potential future checks
  const [majorData, setMajorData] = useState({
    name: "",
    description: "",
    collegeId: collegeId || "", // Ensure collegeId is set
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMajorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!majorData.collegeId) {
      setError("معرف الكلية غير موجود.");
      return;
    }
    if (!majorData.name.trim()) {
      setError("اسم التخصص مطلوب.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createMajor(majorData);
      setSuccess("تمت إضافة التخصص بنجاح!");
      setMajorData({ name: "", description: "", collegeId: collegeId || "" }); // Reset form
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate(`/universities/manage`); // Navigate back to the management page
      }, 1500);
    } catch (err) {
      setError("فشل في إضافة التخصص. يرجى المحاولة مرة أخرى.");
      console.error("Error creating major:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Basic check if user is logged in (more specific advisor check might be needed)
  if (!user) {
    navigate("/login");
    return null; // Or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">إضافة تخصص جديد</h1>
            <button
              onClick={() => navigate(`/universities/manage`)}
              className="bg-white text-blue-600 py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للإدارة
            </button>
          </div>

          {error && (
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
                value={majorData.name}
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
                value={majorData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hidden College ID (or display if needed) */}
            <input type="hidden" name="collegeId" value={majorData.collegeId} />

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
                إضافة التخصص
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddMajor;
