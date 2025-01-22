import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { LogIn, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            يجب تسجيل الدخول أولاً
          </h2>

          <p className="text-gray-600 mb-8">
            عذراً، هذه الصفحة متاحة فقط للمستخدمين المسجلين. يرجى تسجيل الدخول
            للوصول إلى هذا المحتوى.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              تسجيل الدخول
            </Link>

            <Link
              to="/signup"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
