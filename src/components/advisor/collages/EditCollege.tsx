import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getCollegeById,
  updateCollege,
  College,
} from "../../../services/collegeService";
import { useAuth } from "../../../contexts/useAuth";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import {
  Save,
  ArrowRight,
  AlertTriangle,
  Check,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

const EditCollege: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [college, setCollege] = useState<Partial<College>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollege = async () => {
      if (!id) {
        setError("معرف الكلية غير موجود");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getCollegeById(id);
        setCollege({
          ...data,
          location: data.location || "",
          website: data.website || "",
        });
      } catch (err) {
        setError("فشل في تحميل بيانات الكلية");
        console.error("Error fetching college:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id, user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCollege((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!college.name?.trim()) {
      setError("اسم الكلية مطلوب.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const dataToUpdate: Partial<
      Omit<College, "id" | "universityId" | "university" | "majors">
    > = {
      name: college.name,
      description: college.description,
      location: college.location || null,
      website: college.website || null,
    };

    try {
      await updateCollege(id, dataToUpdate);
      setSuccess("تم تحديث الكلية بنجاح!");
      setTimeout(() => {
        navigate(`/universities/manage`);
      }, 1500);
    } catch (err) {
      setError("فشل في تحديث الكلية");
      console.error("Error updating college:", err);
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
            <h1 className="text-2xl font-bold">تعديل بيانات الكلية</h1>
            <button
              onClick={() => navigate(`/universities/manage`)}
              className="bg-white text-blue-600 py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للإدارة
            </button>
          </div>

          {error && submitting && (
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
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                اسم الكلية *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={college.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                value={college.description || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الموقع (اختياري)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={college.location || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: مبنى أ، الدور الثاني"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-gray-700 text-sm font-semibold mb-2 text-right"
              >
                الموقع الإلكتروني (اختياري)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={college.website || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example-college.com"
                  dir="ltr"
                />
              </div>
            </div>

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

export default EditCollege;
