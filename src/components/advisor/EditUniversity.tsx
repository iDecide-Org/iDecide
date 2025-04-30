import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import Link
// Import getImageUrl from universityService
import {
  getUniversityById,
  updateUniversity,
  deleteUniversity,
  getImageUrl,
} from "../../services/universityService";
import { useAuth } from "../../contexts/useAuth";
import Navbar from "../NavBar";
import Footer from "../Footer";
import { MapPin, Save, Trash2, ArrowRight, Plus } from "lucide-react"; // Import Plus

enum UniversityType {
  GOVERNMENTAL = "حكومية",
  PRIVATE = "خاصة",
  NATIONAL = "أهلية", // Ahleya
}
const EditUniversity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [university, setUniversity] = useState({
    id: "",
    name: "",
    type: "" as UniversityType | string, // Initialize with empty string or a default enum value like UniversityType.PRIVATE
    establishment: Number(""),
    collagesCount: 10,
    majorsCount: 50,
    nameAr: "",
    location: "",
    description: "",
    website: "",
    tuitionFees: "",
    admissionRequirements: "",
    image: "",
    majors: [] as string[],
    advisorId: "",
  });

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getUniversityById(id);

        // Check if advisor is authorized to edit this university

        if (data.advisorId !== user?.id) {
          setError("غير مصرح لك بتعديل هذه الجامعة");
          return;
        }
        console.log(data);

        // Map service data to component state shape
        setUniversity({
          id: data.id,
          name: data.name,
          type: data.type ?? "",
          establishment: data.establishment ?? 2000,
          collagesCount: data.collegesCount ?? 20,
          majorsCount: data.majorsCount ?? 50,
          image: data.image ?? "",
          nameAr: data.nameAr ?? "",
          location: data.location,
          description: data.description,
          website: data.website ?? "",
          tuitionFees: data.tuitionFees ?? "",
          admissionRequirements: data.admissionRequirements ?? "",
          majors: data.majors ?? [],
          advisorId: data.advisorId ?? "",
        });

        // Use 'image' instead of 'imageUrl'
        if (data.image) {
          setPreviewImage(getImageUrl(data.image));
        }
      } catch (err) {
        console.error("Error fetching university:", err);
        setError("حدث خطأ أثناء جلب بيانات الجامعة");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id, user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUniversity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMajorsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const majorsArray = e.target.value
      .split(",")
      .map((major) => major.trim())
      .filter(Boolean);

    setUniversity((prev) => ({
      ...prev,
      majors: majorsArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Prepare form data for update
      const formData = new FormData();
      formData.append("name", university.name);
      // formData.append("nameAr", university.nameAr);
      formData.append("location", university.location);
      formData.append("description", university.description);
      formData.append("type", university.type);
      formData.append("establishment", university.establishment.toString());
      formData.append("collegesCount", university.collagesCount.toString());
      formData.append("majorsCount", university.majorsCount.toString());
      formData.append("image", university.image);

      // formData.append("website", university.website);
      // formData.append("tuitionFees", university.tuitionFees);
      // formData.append(
      //   "admissionRequirements",
      //   university.admissionRequirements
      // );
      // Append majors as JSON string
      // formData.append("majors", JSON.stringify(university.majors));
      await updateUniversity(university.id, formData);
      setSuccess("تم تحديث بيانات الجامعة بنجاح");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/universities/manage");
      }, 2000);
    } catch (err) {
      console.error("Error updating university:", err);
      setError("حدث خطأ أثناء تحديث بيانات الجامعة");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذه الجامعة؟ هذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await deleteUniversity(university.id);
      navigate("/advisor/universities");
    } catch (err) {
      console.error("Error deleting university:", err);
      setError("حدث خطأ أثناء حذف الجامعة");
      setLoading(false);
    }
  };

  if (loading && !university.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/universities/manage")}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <ArrowRight className="ml-1 h-5 w-5" />
            العودة للجامعات
          </button>
          {/* Update Link to use parameterized route and remove state */}
          <Link
            to={`/scholarships/add/${university.id}`}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 ml-1" />
            إضافة منحة دراسية
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">تعديل بيانات الجامعة</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 border-r-4 border-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 border-r-4 border-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Name (English) */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم الجامعة
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={university.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>

              {/* University Name (Arabic) */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  نوع الجامعة
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={university.type}
                  onChange={handleChange}
                  // required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الموقع
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={university.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                    dir="rtl"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* establishment */}
              <div>
                <label
                  htmlFor="establishment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  تأسست عام
                </label>
                <input
                  type="text"
                  id="establishment"
                  name="establishment"
                  value={university.establishment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>

              {/* collagesCount */}
              <div>
                <label
                  htmlFor="collagesCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  عدد الكليات
                </label>
                <input
                  type="text"
                  id="collagesCount"
                  name="collagesCount"
                  value={university.collagesCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>

              {/* majorsCount */}
              <div>
                <label
                  htmlFor="majorsCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  عدد التخصصات
                </label>
                <input
                  type="text"
                  id="majorsCount"
                  name="majorsCount"
                  value={university.majorsCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                رابط الصورة
              </label>

              <input
                type="url"
                id="image"
                name="image"
                value={university.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                وصف الجامعة
              </label>
              <textarea
                id="description"
                name="description"
                value={university.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>

            {/* Admission Requirements */}
            <div>
              <label
                htmlFor="admissionRequirements"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                متطلبات القبول
              </label>
              <textarea
                id="admissionRequirements"
                name="admissionRequirements"
                value={university.admissionRequirements}
                onChange={handleChange}
                rows={4}
                // required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>

            {/* Majors */}
            <div>
              <label
                htmlFor="majors"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                التخصصات (مفصولة بفواصل)
              </label>
              <textarea
                id="majors"
                name="majors"
                value={university.majors.join(", ")}
                onChange={handleMajorsChange}
                rows={3}
                // required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                  صورة المعاينة
                </label>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={loading}
              >
                <Trash2 className="ml-2 h-5 w-5" />
                حذف الجامعة
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin ml-2"></div>
                ) : (
                  <Save className="ml-2 h-5 w-5" />
                )}
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditUniversity;
