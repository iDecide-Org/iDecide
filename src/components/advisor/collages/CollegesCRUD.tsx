import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  College,
  deleteCollege,
  getCollegesByUniversity,
} from "../../../services/collegeService";

export const CollegesCRUD: React.FC<{ universityId: string }> = ({
  universityId,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCollegesByUniversity(universityId);
        setColleges(data);
      } catch (err) {
        setError("فشل في تحميل الكليات");
        console.error("Error fetching colleges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, [universityId]);

  const handleAddCollege = () => {
    // Navigate to the Add College page, passing the universityId
    navigate(`/colleges/add/${universityId}`);
  };

  const handleEditCollege = (id: string) => {
    // Navigate to the Edit College page, passing the collegeId
    navigate(`/colleges/edit/${id}`);
  };

  const handleDeleteCollege = async (id: string) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذه الكلية؟ سيتم حذف جميع التخصصات المرتبطة بها."
      )
    ) {
      try {
        setError(null);
        setLoading(true); // Indicate loading during delete
        await deleteCollege(id);
        setColleges(colleges.filter((c) => c.id !== id));
      } catch (err) {
        setError("فشل في حذف الكلية");
        console.error("Error deleting college:", err);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }
  };

  return (
    // Use similar styling as ScholarshipsCRUD
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">إدارة الكليات</h3>
        <button
          onClick={handleAddCollege}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة كلية
        </button>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">جاري تحميل الكليات...</p>
        </div>
      )}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {colleges.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              لم يتم إضافة كليات بعد.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوصف
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.map((college) => (
                  <tr
                    key={college.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {college.name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                      title={college.description || "-"}
                    >
                      {" "}
                      {/* Truncate long descriptions */}
                      {college.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center justify-start gap-3">
                        <button
                          onClick={() => handleEditCollege(college.id)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-md hover:bg-indigo-100"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(college.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
