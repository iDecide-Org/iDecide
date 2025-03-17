import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Navbar from "../NavBar";
import { Upload, Check, AlertTriangle } from "lucide-react";

interface UniversityFormInputs {
  name: string;
  location: string;
  type: string;
  establishment: string;
  description: string;
  collegesCount: string;
  majorsCount: string;
  image: FileList;
}

const AddUniversity: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UniversityFormInputs>();

  const watchImage = watch("image");

  // Handle image preview
  React.useEffect(() => {
    if (watchImage && watchImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(watchImage[0]);
    }
  }, [watchImage]);

  const onSubmit: SubmitHandler<UniversityFormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Here you would normally send the data to your API
      console.log("Form data to submit:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On success
      setSubmitSuccess(true);
      reset();
      setPreviewImage(null);
    } catch (error) {
      setSubmitError("حدث خطأ أثناء إضافة الجامعة. الرجاء المحاولة مرة أخرى.");
      console.error("Error submitting university data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-right mb-2">
            إضافة جامعة جديدة
          </h1>
          <p className="text-gray-600 text-right mb-6">
            قم بإدخال بيانات الجامعة التي تريد إضافتها
          </p>

          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center">
              <Check className="w-5 h-5 ml-2" />
              <span>تمت إضافة الجامعة بنجاح!</span>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 ml-2" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  اسم الجامعة
                </label>
                <input
                  id="name"
                  type="text"
                  dir="rtl"
                  {...register("name", { required: "اسم الجامعة مطلوب" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  الموقع
                </label>
                <input
                  id="location"
                  type="text"
                  dir="rtl"
                  {...register("location", { required: "موقع الجامعة مطلوب" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  نوع الجامعة
                </label>
                <select
                  id="type"
                  dir="rtl"
                  {...register("type", { required: "نوع الجامعة مطلوب" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر النوع</option>
                  <option value="حكومية">جامعة حكومية</option>
                  <option value="خاصة">جامعة خاصة</option>
                  <option value="أهلية">جامعة أهلية</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="collegesCount"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  عدد الكليات
                </label>
                <input
                  id="collegesCount"
                  type="number"
                  dir="rtl"
                  {...register("collegesCount", {
                    required: "عدد الكليات مطلوب",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.collegesCount && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {errors.collegesCount.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="establishment"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  سنة التأسيس
                </label>
                <input
                  id="establishment"
                  type="number"
                  dir="rtl"
                  {...register("establishment", {
                    required: "سنة التأسيس مطلوبة",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.establishment && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {errors.establishment.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="majorsCount"
                className="block text-sm font-medium text-gray-700 mb-2 text-right"
              >
                عدد التخصصات
              </label>
              <input
                id="majorsCount"
                type="number"
                dir="rtl"
                {...register("majorsCount", { required: "عدد التخصصات مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.majorsCount && (
                <p className="text-red-500 text-xs mt-1 text-right">
                  {errors.majorsCount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2 text-right"
              >
                وصف الجامعة
              </label>
              <textarea
                id="description"
                rows={4}
                dir="rtl"
                {...register("description", { required: "وصف الجامعة مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 text-right">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                صورة الجامعة
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>اختر صورة</span>
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        {...register("image", {
                          required: "صورة الجامعة مطلوبة",
                        })}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG أو JPG</p>
                </div>
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1 text-right">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? "جاري الإضافة..." : "إضافة الجامعة"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUniversity;
