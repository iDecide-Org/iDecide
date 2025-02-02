import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Book, GraduationCap, UserCircle2, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router";

// Assuming UserType enum based on the DTO
enum UserType {
  STUDENT = "student",
  ADVISOR = "advisor",
}

// Interface matching the SignupDto
interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { handleSignup } = useAuth(); // Use the handleLogin function from AuthContext

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await handleSignup(data); // Call handleSignup from context
      setSuccess(true); // Show success message

      // Wait for 2 seconds before navigating
      setTimeout(() => {
        navigate("/chatbot");
      }, 2000); // 2000 milliseconds = 2 seconds
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-[50%] p-6">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-8 text-center rounded-t-lg mb-8">
            <div className="flex justify-center mb-4">
              <Book className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold">iDecide</h2>
            <p className="text-blue-100 mt-2">انشئ حسابك</p>
          </div>

          {error && (
            <div className="w-[88%] bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center mx-auto">
              <span className="mr-2">🚫</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <span className="mr-2">✅</span>
              <p>تم انشاء الحساب بنجاح! يمكنك الان تسجيل الدخول</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle2 className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="الاسم بالكامل"
                  dir="rtl"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full text-right text-gray-800 pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="انشئ كلمة السر"
                  dir="rtl"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full text-right text-gray-800 pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Account Type Select */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="type"
                  {...register("type", {
                    required: "Account type is required",
                  })}
                  dir="rtl"
                  className="w-full text-right text-gray-800 pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none transition duration-300"
                >
                  <option value="">اختر نوع حسابك</option>
                  <option value={UserType.STUDENT}>طالب</option>
                  <option value={UserType.ADVISOR}>مرشد اكاديمي</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.type.message}
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
                    جاري تسجيل حسابك....
                  </>
                ) : (
                  "انشئ الحساب"
                )}
              </button>
            </form>
          )}

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-500 mt-8 px-8">
            هل لديك حسابا؟{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              سجل دخولك
            </a>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} iDecide. All rights reserved.
          </div>
        </div>
        {/* Image Section */}
        <div className="w-full md:w-[60%] bg-blue-50 flex items-center justify-center p-0">
          <img
            src="/signup.jpg"
            alt="Signup Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
