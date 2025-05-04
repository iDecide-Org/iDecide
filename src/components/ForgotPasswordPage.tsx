// Create file: c:\Users\mohamed\Desktop\Dev\IDecide\iDecide\src\components\ForgotPasswordPage.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Book } from "lucide-react";
import { Link } from "react-router-dom";

interface ForgotPasswordFormInputs {
  email: string;
}
import { requestPasswordReset } from "../services/authService";
const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const responseMessage = await requestPasswordReset(data.email);
      setMessage(responseMessage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden p-10">
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-8 text-center rounded-t-lg mb-8 -m-10">
          <div className="flex justify-center mb-4">
            <Book className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold">iDecide</h2>
          <p className="text-blue-100 mt-2">نسيت كلمة السر؟</p>
          <p className="text-blue-200 text-sm mt-1">
            ادخل بريدك الالكتروني لاستعادة كلمة السر
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <span className="mr-2">🚫</span>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <span className="mr-2">✅</span>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {!message && ( // Only show form if no success message
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="البريد الالكتروني"
                dir="rtl"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full text-right text-gray-800 pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex justify-center items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري الارسال...
                </>
              ) : (
                "ارسل رابط استعادة كلمة السر"
              )}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="text-center text-sm text-gray-500 mt-8">
          تذكرت كلمة السر؟{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} iDecide. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
