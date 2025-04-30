import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ChevronLeft,
  AlertTriangle,
  Check,
  Calendar,
  Link as LinkIcon,
  Type,
  BookOpen,
  Globe,
  Building,
  Tag,
} from "lucide-react";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import {
  createScholarship,
  CreateScholarshipDto,
} from "../../../services/scholarshipService";
import { getUniversityById } from "../../../services/universityService";
import { useAuth } from "../../../contexts/useAuth";

// Define the type for individual coverage options
type ScholarshipCoverageOption = NonNullable<
  CreateScholarshipDto["coverage"]
>[number];

const AddScholarship: React.FC = () => {
  const navigate = useNavigate();
  const { universityId } = useParams<{ universityId: string }>();
  const { isAdvisor } = useAuth();
  const [universityName, setUniversityName] = useState<string>("");
  const [loadingUniversity, setLoadingUniversity] = useState<boolean>(true);

  const initialScholarshipData: CreateScholarshipDto = {
    name: "",
    provider: "",
    type: "جزئية",
    description: "",
    eligibility: "",
    deadline: "",
    link: "",
    coverage: [],
    country: "",
    fieldOfStudy: "",
    universityId: universityId || "",
  };

  const [scholarshipData, setScholarshipData] = useState<CreateScholarshipDto>(
    initialScholarshipData
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdvisor) {
      navigate("/");
      return;
    }
    if (universityId) {
      setLoadingUniversity(true);
      getUniversityById(universityId)
        .then((uni) => {
          setUniversityName(uni.nameAr || uni.name);
          setScholarshipData((prev) => ({
            ...prev,
            universityId: uni.id,
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch university details:", err);
          setError("فشل في تحميل بيانات الجامعة.");
        })
        .finally(() => {
          setLoadingUniversity(false);
        });
    } else {
      setError("لم يتم تحديد الجامعة.");
      setLoadingUniversity(false);
    }
  }, [isAdvisor, navigate, universityId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setScholarshipData((prev: CreateScholarshipDto) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setScholarshipData((prev: CreateScholarshipDto) => {
      const currentCoverage = prev.coverage || [];
      const coverageValue = value as ScholarshipCoverageOption;
      if (checked) {
        return {
          ...prev,
          coverage: [...currentCoverage, coverageValue],
        };
      } else {
        return {
          ...prev,
          coverage: currentCoverage.filter(
            (item: ScholarshipCoverageOption) => item !== coverageValue
          ),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!scholarshipData.universityId) {
      setError("خطأ: لم يتم تحديد الجامعة.");
      return;
    }

    if (
      !scholarshipData.name ||
      !scholarshipData.provider ||
      !scholarshipData.deadline ||
      !scholarshipData.link ||
      !scholarshipData.description ||
      !scholarshipData.eligibility
    ) {
      setError("يرجى ملء جميع الحقول المطلوبة (*).");
      return;
    }

    setSubmitting(true);

    try {
      let formattedDeadline: string | undefined;
      if (scholarshipData.deadline) {
        const date = new Date(scholarshipData.deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString();
        } else {
          setError("تنسيق تاريخ الموعد النهائي غير صالح.");
          setSubmitting(false);
          return;
        }
      } else {
        setError("يرجى تحديد الموعد النهائي.");
        setSubmitting(false);
        return;
      }

      const dataToSend: CreateScholarshipDto = {
        ...scholarshipData,
        deadline: formattedDeadline,
        coverage: scholarshipData.coverage || [],
      };

      await createScholarship(dataToSend);
      setSuccess("تمت إضافة المنحة بنجاح!");
      setScholarshipData({
        ...initialScholarshipData,
        universityId: universityId || "",
      });
      setTimeout(() => navigate(`/universities/edit/${universityId}`), 2000);
    } catch (err) {
      console.error("Error creating scholarship:", err);
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setSubmitting(false);
    }
  };

  const coverageOptions: {
    value: ScholarshipCoverageOption;
    label: string;
  }[] = [
    { value: "رسوم دراسية", label: "رسوم دراسية" },
    { value: "مصاريف معيشة", label: "مصاريف معيشة" },
    { value: "سفر", label: "سفر" },
    { value: "أخرى", label: "أخرى" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold text-right">
              {loadingUniversity
                ? "جاري تحميل اسم الجامعة..."
                : universityName
                ? `إضافة منحة لجامعة: ${universityName}`
                : "إضافة منحة دراسية جديدة (خطأ في تحميل الجامعة)"}
            </h1>
          </div>

          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-end">
              <p className="ml-2">{error}</p>
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}

          {success && (
            <div className="m-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center justify-end">
              <p className="ml-2">{success}</p>
              <Check className="w-5 h-5" />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 space-y-6"
            dir="rtl"
          >
            {universityId && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  الجامعة
                </label>
                <p className="text-lg font-medium text-gray-800 bg-gray-100 p-3 rounded-md">
                  {loadingUniversity
                    ? "جاري التحميل..."
                    : universityName || "غير متوفر"}
                </p>
                <input type="hidden" name="universityId" value={universityId} />
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                اسم المنحة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={scholarshipData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="provider"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                الجهة المانحة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  required
                  value={scholarshipData.provider}
                  onChange={handleInputChange}
                  placeholder="مثال: جامعة القاهرة، مؤسسة مصر الخير"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                نوع المنحة *
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  required
                  value={scholarshipData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="جزئية">جزئية</option>
                  <option value="كاملة">كاملة</option>
                </select>
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                الوصف *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={scholarshipData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="eligibility"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                شروط الأهلية *
              </label>
              <textarea
                id="eligibility"
                name="eligibility"
                required
                rows={3}
                value={scholarshipData.eligibility}
                onChange={handleInputChange}
                placeholder="اذكر الشروط المطلوبة للتقديم على المنحة..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                آخر موعد للتقديم *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  required
                  value={scholarshipData.deadline}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="link"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                رابط التقديم/التفاصيل *
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="link"
                  name="link"
                  required
                  value={scholarshipData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/scholarship"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                التغطية (اختياري)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coverageOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <input
                      type="checkbox"
                      name="coverage"
                      value={option.value}
                      checked={scholarshipData.coverage?.includes(option.value)}
                      onChange={handleCoverageChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                الدولة المستهدفة (اختياري)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={scholarshipData.country}
                  onChange={handleInputChange}
                  placeholder="مثال: مصر, السعودية"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="fieldOfStudy"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                مجال الدراسة المستهدف (اختياري)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={scholarshipData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="مثال: الهندسة, الطب, علوم الحاسب"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5 ml-1" />
                العودة
              </button>
              <button
                type="submit"
                disabled={submitting || loadingUniversity || !universityId}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                ) : (
                  <Save className="w-5 h-5 ml-2" />
                )}
                إضافة المنحة
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddScholarship;
