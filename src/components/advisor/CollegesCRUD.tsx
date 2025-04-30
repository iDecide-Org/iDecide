import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  College,
  deleteCollege,
  getCollegesByUniversity,
} from "../../services/collegeService";

export const CollegesCRUD: React.FC<{ universityId: string }> = ({
  universityId,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    alert("Add College functionality not implemented yet.");
  };

  const handleEditCollege = (id: string) => {
    alert(`Edit College ${id} functionality not implemented yet.`);
  };

  const handleDeleteCollege = async (id: string) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذه الكلية؟ سيتم حذف جميع التخصصات المرتبطة بها."
      )
    ) {
      try {
        setError(null);
        await deleteCollege(id);
        setColleges(colleges.filter((c) => c.id !== id));
      } catch (err) {
        setError("فشل في حذف الكلية");
        console.error("Error deleting college:", err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">إدارة الكليات</h3>
        <button
          onClick={handleAddCollege}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة كلية
        </button>
      </div>
      {loading && <p>جاري تحميل الكليات...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          {colleges.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
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
                  <tr key={college.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {college.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {college.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEditCollege(college.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCollege(college.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
