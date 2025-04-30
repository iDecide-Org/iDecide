import { Edit, List, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteScholarship,
  getScholarshipsByUniversity,
  Scholarship,
} from "../../../services/scholarshipService";
import { useNavigate } from "react-router";

export const ScholarshipsCRUD: React.FC<{ universityId: string }> = ({
  universityId,
}) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getScholarshipsByUniversity(universityId);
        setScholarships(data);
      } catch (err) {
        setError("فشل في تحميل المنح الدراسية");
        console.error("Error fetching scholarships:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [universityId]);

  const handleAddScholarship = () => {
    navigate(`/scholarships/add/${universityId}`);
  };

  const handleEditScholarship = (id: string) => {
    navigate(`/scholarships/edit/${id}`);
  };

  const handleDeleteScholarship = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المنحة الدراسية؟")) {
      try {
        await deleteScholarship(id);
        setScholarships(scholarships.filter((s) => s.id !== id));
      } catch (err) {
        setError("فشل في حذف المنحة");
        console.error("Error deleting scholarship:", err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          إدارة المنح الدراسية
        </h3>
        <button
          onClick={handleAddScholarship}
          className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors inline-flex items-center"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة منحة
        </button>
      </div>
      {loading && <p>جاري تحميل المنح...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          {scholarships.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              لم يتم إضافة منح دراسية لهذه الجامعة بعد.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المقدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموعد النهائي
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {scholarship.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scholarship.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scholarship.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                      <button
                        onClick={() =>
                          navigate(`/scholarships/${scholarship.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="عرض التفاصيل"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditScholarship(scholarship.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScholarship(scholarship.id)}
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
