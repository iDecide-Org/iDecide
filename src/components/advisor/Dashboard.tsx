import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../NavBar";
import { Plus, List, User, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";

const Dashboard: React.FC = () => {
  const { handleLogout, userName } = useAuth();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-right mb-2">
            {userName} مرحبًا
          </h1>
          <p className="text-gray-600 text-right mb-6">
            لوحة تحكم المرشد الأكاديمي
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/universities/add"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition-all duration-300 flex flex-col items-center"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">إضافة جامعة</h3>
              <p className="text-gray-600 text-center">
                إضافة جامعة جديدة إلى النظام
              </p>
            </Link>

            <Link
              to="/universities/manage"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition-all duration-300 flex flex-col items-center"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <List className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">إدارة الجامعة</h3>
              <p className="text-gray-600 text-center">
                عرض وتعديل وحذف الجامعة
              </p>
            </Link>

            <Link
              to="/profile"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition-all duration-300 flex flex-col items-center"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">الملف الشخصي</h3>
              <p className="text-gray-600 text-center">
                عرض وتعديل بيانات الحساب
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-right mb-4">
            إحصائيات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">الجامعات المضافة</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">الكليات المضافة</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">التخصصات المضافة</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">الطلاب المسجلين</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-lg transition duration-300"
          >
            <LogOut className="w-5 h-5 ml-2" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
