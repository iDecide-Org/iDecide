import React, { useState } from "react";
import Navbar from "../NavBar";
import { Search, Trash2, Edit, Eye, Info, AlertTriangle } from "lucide-react";
import universities from "../../data/universitiesData"; // Import your university data

const ManageUniversities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [deleteConfirmUniversity, setDeleteConfirmUniversity] = useState<
    number | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter universities based on search term and type filter
  const filteredUniversities = universities.filter((university) => {
    const matchesSearch =
      university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? university.type === filterType : true;

    return matchesSearch && matchesType;
  });

  // Handle deleting a university
  const handleDeleteUniversity = (id: number) => {
    // Here you would normally send a DELETE request to your API
    console.log(`Deleting university with ID: ${id}`);

    // Simulate successful deletion
    setDeleteConfirmUniversity(null);
    setSuccessMessage("تم حذف الجامعة بنجاح");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-right mb-2">إدارة الجامعات</h1>
          <p className="text-gray-600 text-right mb-6">
            عرض وتعديل وحذف الجامعات
          </p>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center">
              <Info className="w-5 h-5 ml-2" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن جامعة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-right pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                dir="rtl"
              >
                <option value="">كل الجامعات</option>
                <option value="حكومية">جامعات حكومية</option>
                <option value="خاصة">جامعات خاصة</option>
                <option value="أهلية">جامعات أهلية</option>
              </select>
            </div>
          </div>

          {/* Universities Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-right">
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الجامعة
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموقع
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سنة التأسيس
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((university) => (
                    <tr key={university.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={university.image}
                              alt={university.name}
                            />
                          </div>
                          <div className="mr-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {university.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {university.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {university.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {university.establishment}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 space-x-reverse">
                        <button
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="عرض"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="حذف"
                          onClick={() =>
                            setDeleteConfirmUniversity(university.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <p className="text-gray-500">لم يتم العثور على جامعات</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              عرض{" "}
              <span className="font-medium">{filteredUniversities.length}</span>{" "}
              من أصل <span className="font-medium">{universities.length}</span>{" "}
              جامعة
            </div>
            <div className="flex space-x-2">
              <button className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                السابق
              </button>
              <button className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900 mt-3">
              تأكيد الحذف
            </h3>
            <p className="text-gray-500 mt-2">
              هل أنت متأكد من رغبتك في حذف هذه الجامعة؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                onClick={() => handleDeleteUniversity(deleteConfirmUniversity)}
              >
                نعم، احذف
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => setDeleteConfirmUniversity(null)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUniversities;
