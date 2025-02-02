import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 mx-auto text-blue-600">
          <AlertTriangle className="w-20 h-20 mx-auto" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mb-8">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
